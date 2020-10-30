
import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import {PopupInner, HorizontalFlexBox, H3, FilledButton, VerticalFlexBox} from './ReusableStyles';
import {GlobalContext, CountryResult, CountryMetadata} from './containers/GlobalProvider';
import useMyEffect from '../lib/Hooks/useMyEffect';
import {PieChart, Pie, Sector, ResponsiveContainer} from 'recharts';
// import GoogleMaps from './reusable/GoogleMaps';
const Container = styled.div`
    ${PopupInner};
`;
const ExpandButton = styled.button`
    ${FilledButton};
    background-color: ${props => props.theme.red};
`;
const UnexpandedLowerArea = styled.div`
    ${VerticalFlexBox};
`;
const ExpandedLowerArea = styled.div`
    ${VerticalFlexBox};
    width: 100%;
    min-height: 20rem;
`;
const PieContainer = styled.div`
    ${VerticalFlexBox};
    width: 80%;
    height: 30%;
`;
const CategoryBreakdowns = styled.div`
    ${VerticalFlexBox};
`;
const CategoryBreakdown = styled.div`
    ${HorizontalFlexBox};
`;
const DatasetBreakdowns = styled.div`
    ${VerticalFlexBox};
`;
const DatasetBreakdown = styled.div`
    ${HorizontalFlexBox};
`;

const Ad = styled.div`
    ${HorizontalFlexBox};
`;
const SubTitle = styled.h3`
    ${H3};
`;
const SummaryContainer = styled.div`
    ${VerticalFlexBox};
    width:100%;
`;
const SummaryItem = styled.div`
    width: 100%;
    font-size: 200%;
`;
const TitleContainer = styled.div`
    ${HorizontalFlexBox};
`;
const HorizontalContainer = styled.div`
    ${HorizontalFlexBox};
`;

const renderActiveShape = (props: any) => {
    console.log('starting to render pie chart');
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const returnObject = (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Score ${value.toFixed(2)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
    console.log('pie render ...',returnObject);
    return returnObject;
  };
  
interface CountryBreakdownPopupProps {
    closePopup: any,
}

const CountryBreakdownPopup: React.FunctionComponent<CountryBreakdownPopupProps>  =({closePopup}) =>{
    const gc = useContext(GlobalContext);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [currentCountryData, setCurrentCountryData] = useState<CountryResult|null>(null);
    const [currentCountryMetadata, setCurrentCountryMetadata] = useState<CountryMetadata|null>(null);
    const [activePieIndex, setActivePieIndex]= useState<number>(0);
    const [pieData, setPieData]= useState<readonly object[]|undefined>(undefined);

    //whenever gc.currentCountry changes update currentCountryData and pie data
    useMyEffect([gc.currentCountry],()=>{
        if (!gc.currentCountry || !gc.results || !gc.countries) return;
        const newCountryData = gc.results[gc.currentCountry];
        const newPieData = Object.keys(newCountryData.categoryBreakdown).map(categoryName=>{
            return {
                name:categoryName,
                value:newCountryData.categoryBreakdown[categoryName]
            };
        });
        setPieData(newPieData);
        setCurrentCountryData(newCountryData);
        setCurrentCountryMetadata(gc.countries[gc.currentCountry])
    },[gc.currentCountry, gc.results, setCurrentCountryData, gc.countries]);

    const ads = ['ad 1', 'ad 2 geoes here', 'ad 3...'];
    const endAds = (numberOfDatasets: number)=>{//assuming an insertion ratio of 1 ad to 4 datasets
        return ads.slice((numberOfDatasets/4)-1);
    }//these are the ads that WONT be inserted within the datasets breakdown
    //because there are not enough datasets

    const onPieEnter = (data:any,index:any) =>{
        setActivePieIndex(index);
    }
    

    if (!currentCountryData || !gc.datasets || !currentCountryMetadata) {
        return (<div>Loading country data...</div>);
    } else {
    return (
        <Container>
            <TitleContainer>
                <h1>{currentCountryData.primary_name.toUpperCase()}</h1>
                {/* <img
                alt={currentCountryData.primary_name}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${currentCountryMetadata.alpha_two_code}.svg`}/> */}
            </TitleContainer>
            <h2>Score Summary</h2>
            <HorizontalContainer>
            <SummaryContainer>
                <SummaryItem><b>Overall Ranking:</b> {currentCountryData.rank}</SummaryItem>
                <SummaryItem><b>Total Score:</b> {currentCountryData.totalScore.toFixed(0)}</SummaryItem>
                <SummaryItem><b>Percentile:</b> {currentCountryData.percentile.toFixed(0)}</SummaryItem>
            </SummaryContainer>
            <div>View on Google Maps</div>
            {/* <GoogleMaps/> */}

            <ExpandButton onClick={()=>window.open(`https://wikipedia.org/wiki/${currentCountryData.primary_name.replace(' ','_')}`)}>View Wikipedia Page</ExpandButton>
            </HorizontalContainer>
            <ExpandButton onClick={()=>setShowDetails(prev =>!prev)}>Detailed Score Breakdown</ExpandButton>
            {showDetails?
                <ExpandedLowerArea>
                    {/* <SubTitle>Category Breakdown</SubTitle>
                    <PieContainer>
                    <ResponsiveContainer width={'80%'} height={'80%'}>
                    <PieChart height={200} width={200}>
                        <Pie 
                        activeIndex={activePieIndex}
                        activeShape={renderActiveShape} 
                        data={pieData} 
                        cx={300} 
                        cy={200} 
                        innerRadius={60}
                        outerRadius={80} 
                        fill="#000000"
                        onMouseEnter={onPieEnter}
                        dataKey={'value'}
                        nameKey={'name'}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                    </PieContainer> */}
                    <SubTitle>
                    	Scores per Category
                    </SubTitle>
                    <CategoryBreakdowns>
                        {Object.keys(currentCountryData.categoryBreakdown).map(categoryName=>{
                            return (
                                <CategoryBreakdown key={categoryName}>{categoryName.toUpperCase()}: {currentCountryData.categoryBreakdown[categoryName].toFixed(0)}</CategoryBreakdown>
                            );
                        })}
                    </CategoryBreakdowns>
                    <DatasetBreakdowns>
                        <SubTitle>Scores per dataset</SubTitle>
                    {/* 4 countries ,then an ad, etc. */}
                    {Object.keys(currentCountryData.scoreBreakdown).map((datasetID,index)=>{
                        return (
                            <React.Fragment key={datasetID}>
                            <DatasetBreakdown key={datasetID}>
                                <div>Dataset: {gc.datasets![datasetID].long_name}</div>
                                <div>Score: {currentCountryData.scoreBreakdown[datasetID].score.toFixed(0)}</div>
                                <div>Rank: {currentCountryData.scoreBreakdown[datasetID].rank}</div>
                                <div>Percentile: {currentCountryData.scoreBreakdown[datasetID].percentile.toFixed(0)}</div>
                                <div>Data Was Missing? {currentCountryData.scoreBreakdown[datasetID].dataWasMissing?'Yes':'No'}</div>
                            </DatasetBreakdown>
                            {index%4===0?
                            <Ad key={datasetID+'ad'}>{ads[(index/4)-1]}</Ad>
                            :<></>}
                            </React.Fragment>
                        );
                    })}
                    {/* Remaining ads go at the bottom */}
                    {endAds(Object.keys(currentCountryData.scoreBreakdown).length).map(ad =>{
                        return (
                        <Ad key={ad}>{ad}</Ad>
                        );
                    })}
                    </DatasetBreakdowns>
                </ExpandedLowerArea>
                :
                <UnexpandedLowerArea>
                    {ads.map(ad=>{
                        return (
                            <Ad key={ad}>{ad}</Ad>
                        );
                    })}
                </UnexpandedLowerArea>
            }
        </Container>
    );
    }
}

export default CountryBreakdownPopup;
// 