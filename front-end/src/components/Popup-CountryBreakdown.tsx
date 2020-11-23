import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";
import {
  PopupInner,
  HorizontalFlexBox,
  H3,
  FilledButton,
  VerticalFlexBox,
  ParagraphText,
} from "./ReusableStyles";
import {
  GlobalContext,
  CountryResult,
  CountryMetadata,
} from "./containers/GlobalProvider";
import useMyEffect from "../hooks/useMyEffect";
import { Sector } from "recharts";
import Flag from "react-world-flags";
import Map from "./reusable/Map";
import Table from "./reusable/Table";

const TableContainer = styled(Table)`
  ${ParagraphText};
`;
const Paragraph = styled.div`
  ${ParagraphText};
`;
const BoldP = styled.div`
    ${ParagraphText};
    font-style: bold;
`;
const Container = styled.div`
  ${PopupInner};
  overflow: auto;
`;
const ExpandButton = styled.button`
  ${FilledButton};
  background-color: ${(props) => props.theme.red};
  font-family: ${(props) => props.theme.fontFamHeader};
`;
const WikiButton = styled.button`
  ${FilledButton};
  font-size: ${(props) => props.theme.font4};
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
  ${ParagraphText};
  align-items: flex-end;
`;
const CategoryBreakdown = styled.div`
  ${HorizontalFlexBox};
  ${ParagraphText};
`;
const DatasetBreakdowns = styled.div`
  ${VerticalFlexBox};
  ${ParagraphText};
  width: 100%;
`;
const DatasetBreakdown = styled.div`
  ${HorizontalFlexBox};
`;

const Ad = styled.div`
  ${HorizontalFlexBox};
`;
const SubTitle = styled.h3`
  ${H3};
  ${(props) => props.theme.fontFamHeader};
`;
const SummaryContainer = styled.div`
  ${VerticalFlexBox};
  width: 100%;
  margin: 1rem 0;
`;
const SummaryItem = styled.div`
  ${HorizontalFlexBox};
  width: 100%;
  font-size: 200%;
`;
const TitleContainer = styled.div`
  ${HorizontalFlexBox};
  justify-content: space-evenly;
  font-family: ${(props) => props.theme.fontFamHeader};
`;
const VariableContainer = styled.div`
  ${VerticalFlexBox};
  @media (max-width: ${(props) => props.theme.largerBreakpoint}px) {
    ${VerticalFlexBox};
  }
`;
const MapContainer = styled.div`
  ${VerticalFlexBox};
  width: 66%;
  height: 28vh;
  margin: 1rem;
`;
const UpperFixedHeightContainer = styled.div`
  ${VerticalFlexBox};
  height: 65%;
  @media (max-width: ${(props) => props.theme.largerBreakpoint}px) {
    min-height: 90%;
  }
`;

const renderActiveShape = (props: any) => {
  console.log("starting to render pie chart");
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const returnObject = (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Score ${value.toFixed(2)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
  console.log("pie render ...", returnObject);
  return returnObject;
};

interface CountryBreakdownPopupProps {
  closePopup: any;
}

const CountryBreakdownPopup: React.FunctionComponent<CountryBreakdownPopupProps> = ({
  closePopup,
}) => {
  const gc = useContext(GlobalContext);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [
    currentCountryData,
    setCurrentCountryData,
  ] = useState<CountryResult | null>(null);
  const [
    currentCountryMetadata,
    setCurrentCountryMetadata,
  ] = useState<CountryMetadata | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number>(0);
  const [pieData, setPieData] = useState<readonly object[] | undefined>(
    undefined
  );
  const [detailedTables, setDetailedTables] = useState<JSX.Element[] | null>(
    null
  ); //holds the jsx tables with per-dataset breakdown, as well as the inserted ads
  const [ads, setAds] = useState<string[]>(["", "", ""]);

  //whenever gc.currentCountry changes update currentCountryData and pie data
  useMyEffect(
    [gc.currentCountry],
    () => {
      if (!gc.currentCountry || !gc.results || !gc.countries) return;
      const newCountryData = gc.results[gc.currentCountry];
      const newPieData = Object.keys(newCountryData.categoryBreakdown).map(
        (categoryName) => {
          return {
            name: categoryName,
            value: newCountryData.categoryBreakdown[categoryName],
          };
        }
      );
      setPieData(newPieData);
      setCurrentCountryData(newCountryData);
      setCurrentCountryMetadata(gc.countries[gc.currentCountry]);
    },
    [gc.currentCountry, gc.results, setCurrentCountryData, gc.countries]
  );

  //whenever current country data score breakdown changes, update the per-dataset jsx tables
  useMyEffect(
    [true],
    () => {
      // console.log('might update per dataset jsx tables here...', currentCountryData, gc.datasets);
      if (
        !currentCountryData ||
        !currentCountryData.scoreBreakdown ||
        !gc.datasets
      )
        return;
      // console.log('WILL update per dataset jsx tables now...');
      //! important variable here, determines how often ads are inserted
      const datasetsPerAd: number = 4;
      const scoreBreakdown = currentCountryData!.scoreBreakdown;

      const newDetailedTables = []; // <Table elements holding 4 rows, with ads inserted between each table elemment
      //make list of all rows to go into the tables
      const allRows = Object.keys(scoreBreakdown).map((datasetID) => {
        const thisDataset = scoreBreakdown[datasetID];
        return [
          <div style={{ width: "30vw" }}>
            {gc.datasets![datasetID].long_name}
          </div>,
          thisDataset.score.toFixed(0),
          thisDataset.rank,
          thisDataset.percentile.toFixed(0),
          thisDataset.dataWasMissing ? "Yes" : "No",
        ];
      });
      console.log('done making all rows', allRows);
      //determine how many tables of 'datasetsPerAd' or less rows there needs to be
      const numberOfTables: number = (allRows.length>datasetsPerAd)?
        (allRows.length * 1.0) / datasetsPerAd +
        (allRows.length % datasetsPerAd > 0 ? 1 : 0)
        :1;
      // console.log('going to make tables now, with ', numberOfTables);
      
      for (let i = 0; i < numberOfTables; i++) {
        let rowsForTable: any[] =[];
        if (allRows.length === 1){
          rowsForTable = allRows;
        } else if (allRows.length < datasetsPerAd){
          rowsForTable = allRows;
        } else {
          rowsForTable = allRows.slice(i* datasetsPerAd, i*datasetsPerAd +datasetsPerAd);
        }
      console.log('rows for table ',rowsForTable);
        const newTable = (
          <TableContainer
            header={[
              'DATASET NAME',
              'SCORE',
              'RANK',
              'PERCENTILE',
              'DATA MISSING?',
            ]}
            rows={rowsForTable}
            key={"table" + i}
          />
        );
        console.log(newTable);
        newDetailedTables.push(newTable); //table
        if (i === numberOfTables - 1) break; // don't place an ad below the last table, that is handled elsewhere
        newDetailedTables.push(ads[i]?<Ad key={'ads[i]'}>{ads[i]}</Ad>:<></>); //ad
      }
      // console.log('setting detailed tables elements to...',newDetailedTables);
      setDetailedTables(newDetailedTables);
    },
    [currentCountryData, setDetailedTables, gc.datasets]
  );

  const endAds = useCallback(
    (numberOfDatasets: number) => {
      //assuming an insertion ratio of 1 ad to 4 datasets
      return ads.slice(numberOfDatasets / 4 - 1);
    },
    [ads]
  ); //these are the ads that WONT be inserted within the datasets breakdown
  //because there are not enough datasets

  const onPieEnter = (data: any, index: any) => {
    setActivePieIndex(index);
  };

  if (!currentCountryData || !gc.datasets || !currentCountryMetadata) {
    return <div>Loading country data...</div>;
  } else {
    return (
      <Container>
        {/* <UpperFixedHeightContainer> */}
        <TitleContainer>
          <h1>{currentCountryData.primary_name.toUpperCase()}</h1>
          <Flag
            code={currentCountryMetadata.alpha_three_code}
            style={{ width: "30%" }}
          />
        </TitleContainer>
        <VariableContainer>
          <SummaryContainer>
            <SummaryItem>
              <BoldP>
                Overall Ranking
              </BoldP>
              <Paragraph>{currentCountryData.rank}</Paragraph>
            </SummaryItem>
            <SummaryItem>
              <BoldP>
                Total Score:
              </BoldP>
              <Paragraph>{currentCountryData.totalScore.toFixed(0)}</Paragraph>
            </SummaryItem>
            <SummaryItem>
              <BoldP>
                Percentile:
              </BoldP>
              <Paragraph>{currentCountryData.percentile.toFixed(0)}</Paragraph>
            </SummaryItem>
          </SummaryContainer>
          <WikiButton
            onClick={() =>
              window.open(
                `https://wikipedia.org/wiki/${currentCountryData.primary_name.replace(
                  " ",
                  "_"
                )}`
              )
            }
          >
            View Wikipedia Page
          </WikiButton>
        </VariableContainer>
        <MapContainer>
          <Map locationName={currentCountryMetadata.primary_name} />
        </MapContainer>
        {/* </UpperFixedHeightContainer> */}
        {/* <ExpandButton onClick={()=>setShowDetails(prev =>!prev)}>Detailed Score Breakdown</ExpandButton> */}
        {/* {showDetails? */}
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
          <SubTitle>CATEGORY BREAKDOWN</SubTitle>
          <CategoryBreakdowns>
            {Object.keys(currentCountryData.categoryBreakdown).map(
              (categoryName) => {
                return (
                  <CategoryBreakdown key={categoryName}>
                    {categoryName.toUpperCase()}:{" "}
                    {currentCountryData.categoryBreakdown[categoryName].toFixed(
                      0
                    )}
                  </CategoryBreakdown>
                );
              }
            )}
          </CategoryBreakdowns>
          <DatasetBreakdowns>
            <SubTitle>PER-DATASET BREAKDOWN</SubTitle>
            {detailedTables ? detailedTables : <></>}
            {/* Remaining ads go at the bottom */}
            {endAds(Object.keys(currentCountryData.scoreBreakdown).length).map(
              (ad) => {
                if (!ad) return <></>;
                return <Ad key={ad}>{ad}</Ad>;
              }
            )}
          </DatasetBreakdowns>
        </ExpandedLowerArea>
        {/* :
                <UnexpandedLowerArea>
                    {ads.map(ad=>{
                        return (
                            <Ad key={ad}>{ad}</Ad>
                        );
                    })}
                </UnexpandedLowerArea>
            } */}
      </Container>
    );
  }
};

export default CountryBreakdownPopup;
//
