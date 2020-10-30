import Color from 'color';

const bestColor = Color.rgb(31, 222, 88);
const worstColor = Color.rgb(216, 28, 28);
const onePercent = (bestColor.hue()-worstColor.hue())/100;

const getColorFromPercentile = (percentile: number) =>{
    return worstColor.rotate(onePercent*percentile).string();
}
export default getColorFromPercentile;