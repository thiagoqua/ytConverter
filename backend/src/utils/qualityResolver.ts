/**
 * Maps the quality label used by the API ('low' | 'medium' | 'high')
 * to yt-dlp's --audio-quality flag value.
 *
 * yt-dlp accepts a VBR scale (0 = best, 9 = worst) or a fixed bitrate
 * string like "128K". Para MP3, los valores recomendados por yt-dlp son la escala VBR.
 */
export default function getQualityAsBitrate(quality: string): string {
  if (quality === 'low')    return '9'; // ~65 kbps
  if (quality === 'medium') return '5'; // ~130 kbps
  return '0'; // ~250 kbps (best)
}