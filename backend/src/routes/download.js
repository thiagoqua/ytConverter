import { Router } from "express";
import ytdl from "ytdl-core";

export const downloadRouter = Router();

downloadRouter.get('/',async (req,res) => {
  const url = req.query.url;
  const format = req.query.format;
  
  if(!ytdl.validateURL(url))
    return res.status(400);

  res.header('Content-Disposition',`attachment;filename=converted.${format}`);

  await ytdl(url,{filter:'audioonly',format:'mp3',quality:'highestaudio'}).pipe(res);
});