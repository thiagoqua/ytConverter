export default function getQualityAsBitrate(quality){
  let bitRate;
  if(quality === 'low')
    bitRate = 96;
  else if(quality === 'medium')
    bitRate = 190;
  else
    bitRate = 296;

  return bitRate;
}