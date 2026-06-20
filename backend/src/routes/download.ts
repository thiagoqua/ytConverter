import { Router } from "express";
import { spawn } from "child_process";
import getEncodedFilename from "../utils/URLhelper";
import getQualityAsBitrate from "../utils/qualityResolver";
import { ensureValidParams } from "../utils/paramsValidator";

export const downloadRouter = Router();

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
    // Step 1: fetch the video title so we can set the Content-Disposition filename
    const titleProcess = spawn("yt-dlp", ["--print", "title", "--no-playlist", url]);

    let videoTitle = "";
    titleProcess.stdout.on("data", (chunk) => { videoTitle += chunk.toString(); });

    await new Promise<void>((resolve, reject) => {
      titleProcess.on("close", (code) => (code === 0 ? resolve() : reject(new Error("No se pudo obtener el título del video"))));
    });

    const fileName = getEncodedFilename(`${videoTitle.trim()}.${format}`);
    res.header("Content-Disposition", `attachment;filename=${fileName}`);

    // Step 2: spawn yt-dlp to extract audio and stream it directly to the response.
    // -x            → extract audio only
    // --audio-format → target container (mp3 | wav)
    // --audio-quality → target bitrate; ignored for wav (yt-dlp uses best available)
    // -o -           → write output to stdout instead of a file
    // --no-playlist  → never download a full playlist, only the video URL given
    const args = [
      "-x",
      "--audio-format", format,
      "--audio-quality", format === "mp3" ? getQualityAsBitrate(quality) : "0",
      "--no-playlist",
      "-o", "-",
      url,
    ];

    const ytdlp = spawn("yt-dlp", args);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (data) => console.error(`[yt-dlp] ${data}`));

    // If the client disconnects mid-download, kill the process to avoid zombies
    req.on("close", () => ytdlp.kill());

    ytdlp.on("close", (code) => {
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({ message: "Error al procesar el audio" });
      }
    });

  } catch (err: any) {
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
});
