import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {
    AreaChart, ResponsiveContainer, Area,
} from 'recharts';

const Graph = styled.div`
    position: absolute;
    top:0.7rem;
    left: 1rem;
    right: 1rem;
`;

export interface DistributionGraphProps{
    distributionMap: number[],
    strokeColor: string,
    fillColor: string,
}
const DistributionGraph: React.FunctionComponent<DistributionGraphProps> =({distributionMap, strokeColor, fillColor})=> {

    const getChartData = useCallback((distributionMap: Array<number>) => {
        const list: Array<number> = Array.isArray(distributionMap) ? distributionMap : JSON.parse(distributionMap);
        const chartData: object[] = list.map((count: number, index: number) => {
            return { percent: index, count: count };
        })
        return chartData;
    }, []);
return (
                    <Graph>
                        <ResponsiveContainer minWidth="100%" height={22}>
                            <AreaChart
                                data={getChartData(distributionMap)}
                                margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
                            >
                                <Area type="monotone" dataKey="count" stroke={strokeColor} fill={fillColor} />
                            </AreaChart>
                        </ResponsiveContainer>

                    </Graph>
);
}
export default DistributionGraph;
