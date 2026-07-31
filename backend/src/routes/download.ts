import { Router } from "express";
import { spawn } from "child_process";
import getEncodedFilename from "../utils/URLhelper";
import getQualityAsBitrate from "../utils/qualityResolver";
import { ensureValidParams } from "../utils/paramsValidator";

export const downloadRouter = Router();

// Extra arguments for yt-dlp to bypass YouTube bot detection / player restrictions in cloud datacenters
const getBaseYtDlpArgs = (): string[] => {
  const args: string[] = [
    "--no-playlist",
    "--extractor-args", "youtube:player_client=android,web",
  ];

  if (process.env.YT_COOKIES_PATH) {
    args.push("--cookies", process.env.YT_COOKIES_PATH);
  }
  if (process.env.YT_PROXY) {
    args.push("--proxy", process.env.YT_PROXY);
  }

  return args;
};

const fetchVideoTitle = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = [...getBaseYtDlpArgs(), "--print", "title", url];
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
        resolve(videoTitle.trim());
      } else {
        console.error(`[yt-dlp title error] code ${code}: ${stderrLog}`);
        reject(new Error(stderrLog.trim() || "No se pudo obtener el título del video"));
      }
    });

    titleProcess.on("error", (err) => {
      console.error("[yt-dlp title process error]", err);
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

  try {
    ensureValidParams(url, format, quality);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
    return;
  }

  try {
    // Step 1: fetch the video title. Fallback to a default name if YouTube blocks title metadata retrieval
    let videoTitle = "audio";
    try {
      videoTitle = await fetchVideoTitle(url);
    } catch (err: any) {
      console.warn(`[yt-dlp title fallback] Could not fetch title: ${err.message}. Using fallback title "audio".`);
    }

    const fileName = getEncodedFilename(`${videoTitle}.${format}`);
    res.header("Content-Disposition", `attachment; filename="${fileName}"`);

    // Step 2: spawn yt-dlp to extract audio and stream it directly to response
    const args = [
      "-x",
      "--audio-format", format,
      "--audio-quality", format === "mp3" ? getQualityAsBitrate(quality) : "0",
      ...getBaseYtDlpArgs(),
      "-o", "-",
      url,
    ];

    const ytdlp = spawn("yt-dlp", args);

    let ytdlpStderr = "";

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (data) => {
      const msg = data.toString();
      ytdlpStderr += msg;
      console.error(`[yt-dlp] ${msg}`);
    });

    // If client disconnects mid-download, kill process
    req.on("close", () => ytdlp.kill());

    ytdlp.on("close", (code) => {
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({
          message: ytdlpStderr.trim() || "Error al procesar el audio"
        });
      }
    });

  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ message: err.message });
    }
  }
});

