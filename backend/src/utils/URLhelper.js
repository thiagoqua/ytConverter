export default function getEncodedFilename(filename) {
  //encodes the filename to send correctly in the url
  const sanitizedFilename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  return encodeURIComponent(sanitizedFilename);
}
