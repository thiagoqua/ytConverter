import { Router } from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";

export const downloadRouter = Router();

downloadRouter.get("/", async (req, res) => {
  const url = req.query.url;
  const format = req.query.format.toLowerCase() || "mp3";

  if (!url) 
    return res.status(400).json({ message: "Bad Youtube URL" }).send();

  if (!ytdl.validateURL(url))
    return res.status(400).json({ message: "Bad Youtube URL" }).send();

  if (format !== "wav" && format !== "mp3")
    return res.status(400).json({ message: "Bad format" }).send();

  res.header("Content-Disposition", `attachment;filename=converted.${format}`);

  if (format == "wav") {
    const stream = await ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    ffmpeg()
      .input(stream)
      .audioBitrate(296)
      .toFormat(format)
      .on("error", (err) => {
        console.log(err);
        if (!res.headersSent)
          res.status(500).send("Server encountered an error.");
        else res.end();
      })
      .pipe(res, { end: true });
  } else {
    await ytdl(url, {
      filter: "audioonly",
      format: format,
      quality: "highestaudio",
    }).pipe(res);
  }
});

// downloadRouter.get("/video", async (req, res) => {
//   const url = req.query.url;

//   if (!url || !ytdl.validateURL(url))
//     return res.status(400).send("Bad Youtube URL");

//   const videoStream = await ytdl(url, {
//     quality: "highestvideo",
//     filter: (format) => format.container === "mp4",
//   });

//   const audioStream = await ytdl(url, {
//     filter: "audioonly",
//     quality: "highestaudio",
//   });

//   ffmpeg()
//     .input(videoStream)
//     .input(audioStream)
//     .outputOptions("-c:v","copy")
//     .outputOptions("-c:a","aac")
//     .toFormat("mp4")
//     .on("error", (err) => {
//       console.error("Error:", err);
//       if (!res.headersSent)
//         res.status(500).send("Server encountered an error.");
//       else res.end();
//     })
//     .pipe(res, { end: true });
// });
