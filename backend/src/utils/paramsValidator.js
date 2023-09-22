import ytdl from "ytdl-core";

export function ensureValidParams(url,format,quality){
  format = format?.toLowerCase() || "mp3";

  if (!url) 
    throw new Error("Bad Youtube URL");

  if (!ytdl.validateURL(url))
    throw new Error("Bad Youtube URL")

    //todo quality
}