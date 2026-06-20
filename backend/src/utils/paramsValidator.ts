const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

const availableFormats = ['mp3', 'wav'];
const availableQualities = ['low', 'medium', 'high'];

export function ensureValidParams(url: string, format: string, quality: string) {
  if (!url || !YOUTUBE_URL_REGEX.test(url))
    throw new Error("Youtube URL inválida");

  if (!format || !availableFormats.includes(format.toLowerCase()))
    throw new Error("Formato inválido");

  if (format === 'mp3') {
    if (!quality || !availableQualities.includes(quality.toLowerCase()))
      throw new Error("Calidad inválida");
  }
}