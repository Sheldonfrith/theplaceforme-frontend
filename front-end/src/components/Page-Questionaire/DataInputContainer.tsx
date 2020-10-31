import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled, {ThemeContext} from 'styled-components';
import {Info} from '@material-ui/icons';
import InfoPopup from './InfoPopup';
import {
    AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  } from 'recharts';
  import useMyEffect from '../../lib/Hooks/useMyEffect';

export const DisabledOverlay = styled.div<{display: string}>`
    display: ${props=> props.display};
    /* background-color: ${props=>props.theme.lightOverlay}; */
    background-image: radial-gradient(${props =>props.theme.white},transparent);
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props=>props.theme.black};
`;
export const Container = styled.div`
    position: relative;
    min-height: 10.7rem;
    max-height: 10.7rem;
    width:100%;
`;

export const BlurContainer = styled.div<{blur:boolean}>`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right:0;
    filter: ${props=>props.blur?`blur(4px)`:``};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    box-shadow: 1px 3px 3px rgba(0,0,0,0.25);
    border-radius: 1rem;
    border-color: rgb(255,255,255,0.5);
    border-style: solid;
    border-width: 0.01rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    padding: 0.5rem;
    background: white;
`;

const Graph = styled.div`
    position: absolute;
    top:0.7rem; 
    left: 1rem;
    right: 1rem;
`;

const TopRightNumber = styled.div`
    position: absolute;
    top: -0.3rem;
    right: 0.5rem;
    font-size: ${props=>props.theme.font1};
    color: ${props=>props.theme.black};
`;
const TopLeftLabel = styled.div`
    position: absolute;
    top: -0.3rem;
    left: 0.5rem;
    font-size: ${props=>props.theme.font2};
    color: ${props=>props.theme.black};
`;
const Slider = styled.input`
    width:70vw;
    margin: 3rem 0 0 0;
`;
const PreciseValueArea = styled.input`
    background: white;
    font-size: ${props=>props.theme.font3};
    color: ${props=>props.theme.black};
    border-radius: 0.5rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-style: none;
    padding:0 0.5rem;
    margin: 0;
    width:10rem;
    :hover{
        color: ${props=>props.theme.red};
    }
`;
export const MainTextArea = styled.div`
    font-size: ${props=>props.theme.font3};
    color: ${props=>props.theme.black};
    max-width: 60%;
    width: 100%;
`;


interface DataInputContainerProps{
    distributionMap?: Array<number>,
    topRightNumber?: number,
    topLeftString?: string,
    min: number,
    max: number,
    mainText: string,
    sliderValue: number,
    sliderOnChange: any,
    disabled: boolean

}
const DataInputContainer: React.FunctionComponent<DataInputContainerProps> =({
    children,
    distributionMap,
    topRightNumber,
    topLeftString,
    min,
    max,
    mainText,
    sliderValue,
    sliderOnChange,
    disabled,
})=> {

    const [topRightString, setTopRightString] = useState<string|null>(null);

//make sure sliderValue is always within min and max
//run on mount
useMyEffect([true],()=>{
    if (min && max && sliderValue){
    //if it is not, set it to the closest allowed value
    if (max < sliderValue){
        sliderOnChange(max, true);
    }
    if (sliderValue <min){
        sliderOnChange(min, true);
    }
    }
    //convert topRightNumber if it exists to a less precise number
if (topRightNumber!==null && topRightNumber!==undefined){
    setTopRightString(topRightNumber.toFixed(2)+'%');
}
},[]);



const getChartData = useCallback((distributionMap: Array<number>)=>{
    const list: Array<number> = Array.isArray(distributionMap)?distributionMap:JSON.parse(distributionMap);
    const chartData: object[] = list.map((count: number,index:number)=>{
        return {percent: index, count:count};
    })
    return chartData;
    },[]);
    const theme = useContext(ThemeContext);
   
return (
<Container>
<DisabledOverlay display={disabled?'flex':'none'}>Select an 'importance' above 0 to change this value.</DisabledOverlay>
<BlurContainer blur={disabled}>
{distributionMap?
<Graph>
<ResponsiveContainer minWidth="100%" height={22}>
    <AreaChart
    data={getChartData(distributionMap)}
    margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
    >
    <Area type="monotone" dataKey="count" stroke={theme.red} fill={theme.red} />
    </AreaChart>
</ResponsiveContainer>

</Graph>
:<></>}
{topLeftString?
<TopLeftLabel>{topLeftString}</TopLeftLabel>
:<></>
}
{topRightString?
<TopRightNumber>{topRightString}</TopRightNumber>
:<></>}
<Slider
    type="range"
    onChange={sliderOnChange}
    min={min ||0}
    max={max ||100}
    value={sliderValue}
/>
<PreciseValueArea
    value={sliderValue.toString()}
    onChange={sliderOnChange}
/>
<MainTextArea>{mainText}</MainTextArea>
<InfoPopup>{children}</InfoPopup>
</BlurContainer>
</Container>
);
}

export default DataInputContainer;
