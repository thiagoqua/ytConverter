import { Router } from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import getEncodedFilename from "../utils/URLhelper.js";
import getQualityAsBitrate from "../utils/qualityResolver.js";
import { ensureValidParams } from "../utils/paramsValidator.js";

export const downloadRouter = Router();

downloadRouter.get("/", async (req, res) => {
  const { url, format, quality } = req.query;

  try {
    ensureValidParams(url, format, quality);

    const qualityAsBitrate = format == 'mp3' ? getQualityAsBitrate(quality) : 296;
    const videoTitle = await ytdl.getBasicInfo(url);
    const fileName = getEncodedFilename(
      `${videoTitle.videoDetails.title}.${format}`
    );
    const stream = await ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    res.header("Content-Disposition", `attachment;filename=${fileName}`);

    ffmpeg()
      .input(stream)
      .audioBitrate(qualityAsBitrate)
      .toFormat(format)
      .on("error", (err) => {
        console.log(err);
        if (!res.headersSent) res.status(500).send("Server error");
        else res.end();
      })
      .pipe(res, { end: true });
  } catch (err) {
    res.status(400).json({ message: err.message }).send();
  }
});
