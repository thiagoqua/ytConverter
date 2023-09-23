import ytdl from "ytdl-core";

const availableFormats = ['mp3','wav'];
const availableQualities = ['low','medium','high'];

export function ensureValidParams(url,format,quality){
  if (!url) 
    throw new Error("Youtube URL inválida");

  if (!ytdl.validateURL(url))
    throw new Error("Youtube URL inválida");

  if(!format)
    throw new Error("Formato inválido");

  if(!availableFormats.find(f => f === format.toLowerCase()))
    throw new Error("Formato inválido");

  if(format === 'mp3'){
    if(!quality)
      throw new Error("Calidad inválida");

    if(!availableQualities.find(q => q === quality.toLowerCase()))
      throw new Error("Calidad inválido");
  }
}