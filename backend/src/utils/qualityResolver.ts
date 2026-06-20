/**
 * Maps the quality label used by the API ('low' | 'medium' | 'high')
 * to yt-dlp's --audio-quality flag value.
 *
 * yt-dlp accepts a VBR scale (0 = best, 9 = worst) or a fixed bitrate
 * string like "128K". We use fixed bitrates for predictable file sizes.
 */
export default function getQualityAsBitrate(quality: string): string {
  if (quality === 'low')    return '128K';
  if (quality === 'medium') return '192K';
  return '320K';
}