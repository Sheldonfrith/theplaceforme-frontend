import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {Info} from '@material-ui/icons';
import InfoPopup from './InfoPopup';
import {
    AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  } from 'recharts';


export const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
`;

const Graph = styled.div``;

const TopRightNumber = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.5rem;
    color: ${props=>props.theme.white};
`;
const Slider = styled.div`
`;
const PreciseValueArea = styled.input`
    font-size: 0.5rem;
    color: ${props=>props.theme.white};
`;
export const MainTextArea = styled.div`
    font-size: 0.5rem;
    color: ${props=>props.theme.white};
`;


interface DataInputContainerProps{
    distributionMap?: Array<number>,
    topRightNumber?: string,
    min?: number|null|undefined,
    max?: number|null|undefined,
    mainText: string
}
const DataInputContainer: React.FunctionComponent<DataInputContainerProps> =({
    children,
    distributionMap,
    topRightNumber,
    min,
    max,
    mainText
})=> {

const getChartData = (distributionMap: Array<number>)=>{
    const chartData: object[] =[];
    const list: Array<number> = Array.isArray(distributionMap)?distributionMap:JSON.parse(distributionMap);
    list.map((count: number,index:number)=>{
        chartData.push({percent: index, count:count});
    })
    return chartData;
    }
   
return (
<Container>
{distributionMap?
<Graph>
<ResponsiveContainer width="100%" height={30}>
    <AreaChart
    data={getChartData(distributionMap)}
    margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
    >
    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
</ResponsiveContainer>

</Graph>
:<></>}
{topRightNumber?
<TopRightNumber>{topRightNumber}</TopRightNumber>
:<></>}
<Slider></Slider>
<PreciseValueArea/>
<MainTextArea>{mainText}</MainTextArea>
<InfoPopup>{children}</InfoPopup>
</Container>
);
}

export default DataInputContainer;
