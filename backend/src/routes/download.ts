import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import getEncodedFilename from "../utils/URLhelper";
import getQualityAsBitrate from "../utils/qualityResolver";
import { ensureValidParams } from "../utils/paramsValidator";

export const downloadRouter = Router();

// Helper to resolve cookies file from YT_COOKIES_PATH or YT_COOKIES environment variable
const getCookiesFilePath = (): string | null => {
  if (process.env.YT_COOKIES_PATH && fs.existsSync(process.env.YT_COOKIES_PATH)) {
    return process.env.YT_COOKIES_PATH;
  }

  if (process.env.YT_COOKIES) {
    try {
      const cookiesTmpPath = path.join(os.tmpdir(), "yt_cookies.txt");
      let content = process.env.YT_COOKIES;
      // Decode base64 if not plain text Netscape format
      if (!content.includes("youtube.com") && !content.includes("# Netscape")) {
        content = Buffer.from(content, "base64").toString("utf-8");
      }
      fs.writeFileSync(cookiesTmpPath, content, "utf-8");
      return cookiesTmpPath;
    } catch (e) {
      console.error("[COOKIES ENV ERROR]", e);
    }
  }

  return null;
};

// Extra arguments for yt-dlp
const getBaseYtDlpArgs = (): string[] => {
  const args: string[] = [
    "--no-playlist",
  ];

  const cookiesPath = getCookiesFilePath();
  if (cookiesPath) {
    console.log(`[COOKIES] Using cookies file: ${cookiesPath}`);
    args.push("--cookies", cookiesPath);
  }

  if (process.env.YT_PROXY) {
    args.push("--proxy", process.env.YT_PROXY);
  }

  return args;
};

const fetchVideoTitle = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = [...getBaseYtDlpArgs(), "--print", "title", url];
    console.log(`[TITLE FETCH] Spawning yt-dlp title process with args:`, args);
    const titleProcess = spawn("yt-dlp", args);

    let videoTitle = "";
    let stderrLog = "";

    titleProcess.stdout.on("data", (chunk) => {
      videoTitle += chunk.toString();
    });

    titleProcess.stderr.on("data", (chunk) => {
      stderrLog += chunk.toString();
    });

    titleProcess.on("close", (code) => {
      if (code === 0 && videoTitle.trim().length > 0) {
        console.log(`[TITLE SUCCESS] Fetched title: "${videoTitle.trim()}"`);
        resolve(videoTitle.trim());
      } else {
        console.error(`[TITLE ERROR] Exit code ${code}. Stderr: ${stderrLog.trim()}`);
        reject(new Error(stderrLog.trim() || "No se pudo obtener el título del video"));
      }
    });

    titleProcess.on("error", (err) => {
      console.error("[TITLE SPAWN ERROR]", err);
      reject(err);
    });
  });
};

downloadRouter.get("/", async (req, res) => {
  const { url, format, quality } = req.query as {
    url: string;
    format: string;
    quality: string;
  };

  console.log(`\n--- [DOWNLOAD REQUEST RECEIVED] ---`);
  console.log(`URL: ${url} | Format: ${format} | Quality: ${quality}`);

  try {
    ensureValidParams(url, format, quality);
  } catch (err: any) {
    console.error(`[VALIDATION ERROR] ${err.message}`);
    res.status(400).json({ message: err.message });
    return;
  }

  // Create a unique temporary output file path to avoid FFmpeg non-seekable stdout pipe issues
  const tempId = Date.now() + "_" + Math.random().toString(36).substring(2, 8);
  const tempFilePath = path.join(os.tmpdir(), `yt_audio_${tempId}.${format}`);
  console.log(`[TEMP FILE] Created path: ${tempFilePath}`);

  try {
    // Step 1: fetch video title (fallback to "audio" if fails)
    let videoTitle = "audio";
    try {
      videoTitle = await fetchVideoTitle(url);
    } catch (err: any) {
      console.warn(`[TITLE FALLBACK WARNING] Could not fetch title: ${err.message}. Using fallback name "audio".`);
    }

    // Step 2: Download & convert using yt-dlp to temp file
    const args = [
      "-x",
      "--audio-format", format,
      "--audio-quality", format === "mp3" ? getQualityAsBitrate(quality) : "0",
      ...getBaseYtDlpArgs(),
      "-o", tempFilePath,
      url,
    ];

    console.log(`[CONVERSION START] Spawning yt-dlp audio extraction with args:`, args);
    const ytdlp = spawn("yt-dlp", args);
    let ytdlpStderr = "";

    ytdlp.stderr.on("data", (data) => {
      const msg = data.toString();
      ytdlpStderr += msg;
      console.log(`[yt-dlp log] ${msg.trim()}`);
    });

    req.on("close", () => {
      console.log(`[CLIENT DISCONNECTED] Killing process and cleaning up ${tempFilePath}`);
      ytdlp.kill();
      if (fs.existsSync(tempFilePath)) {
        fs.unlink(tempFilePath, () => {});
      }
    });

    await new Promise<void>((resolve, reject) => {
      ytdlp.on("close", (code) => {
        const fileExists = fs.existsSync(tempFilePath);
        const fileSize = fileExists ? fs.statSync(tempFilePath).size : 0;
        console.log(`[CONVERSION FINISHED] Exit Code: ${code} | File Exists: ${fileExists} | Size: ${fileSize} bytes`);

        if (code === 0 && fileExists && fileSize > 0) {
          resolve();
        } else {
          reject(new Error(ytdlpStderr.trim() || `yt-dlp falló (código ${code}) sin generar archivo.`));
        }
      });
      ytdlp.on("error", (err) => {
        console.error("[CONVERSION SPAWN ERROR]", err);
        reject(err);
      });
    });

    // Step 3: Stream the verified non-empty file to response
    const fileName = getEncodedFilename(`${videoTitle}.${format}`);
    console.log(`[RESPONSE HEADERS] Setting Content-Disposition filename: "${fileName}"`);

    res.header("Content-Disposition", `attachment; filename="${fileName}"`);
    res.header("Content-Type", format === "mp3" ? "audio/mpeg" : "audio/wav");

    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      console.log(`[STREAM COMPLETE] Download sent successfully. Removing temp file ${tempFilePath}`);
      fs.unlink(tempFilePath, () => {});
    });

    fileStream.on("error", (err) => {
      console.error("[FILE STREAM ERROR]", err);
      if (fs.existsSync(tempFilePath)) {
        fs.unlink(tempFilePath, () => {});
      }
    });

  } catch (err: any) {
    // Clean up temp file on error
    if (fs.existsSync(tempFilePath)) {
      console.log(`[CLEANUP] Removing temp file ${tempFilePath} due to error`);
      fs.unlink(tempFilePath, () => {});
    }
    if (!res.headersSent) {
      console.error(`[DOWNLOAD ROUTER ERROR] Sending HTTP 500:`, err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error(`[DOWNLOAD ROUTER ERROR AFTER HEADERS SENT]`, err.message);
    }
  }
});



