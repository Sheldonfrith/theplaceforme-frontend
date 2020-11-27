import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";
import {
  PopupInner,
  HorizontalFlexBox,
  H3,
  FilledButton,
  VerticalFlexBox,
  ParagraphText,
} from "../reusable-styles";
import { GlobalContext } from "./containers/GlobalProvider";
import { ResultsContext, CountryResult } from './containers/ResultsProvider';
import { CountryMetadata , CountriesContext} from './containers/CountriesProvider';
import {useConditionalEffect} from '../hooks';
import Flag from "react-world-flags";
import Map from "./reusable/Map";
import Table from "./reusable/Table";
import { DatasetsContext } from "./containers/DatasetsProvider";

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

interface CountryBreakdownPopupProps {
  closePopup: any;
}

const CountryBreakdownPopup: React.FunctionComponent<CountryBreakdownPopupProps> = ({
  closePopup,
}) => {
  const rc = useContext(ResultsContext);
  const results = rc.results;
  const currentSelectedCountry = rc.currentSelectedCountry;
  const cc = useContext(CountriesContext);
  const countries = cc.countries;
  const dc = useContext(DatasetsContext);
  const datasets = dc.datasets;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [
    currentSelectedCountryData,
    setCurrentCountryData,
  ] = useState<CountryResult | null>(null);
  const [
    currentSelectedCountryMetadata,
    setCurrentCountryMetadata,
  ] = useState<CountryMetadata | null>(null);
  const [detailedTables, setDetailedTables] = useState<JSX.Element[] | null>(null);
  const [ads, setAds] = useState<string[]>(["", "", ""]);

  //whenever currentSelectedCountry changes update currentSelectedCountryData and pie data
  useConditionalEffect(
    [currentSelectedCountry],
    () => {
      if (!currentSelectedCountry || !results || !countries) return;
      const newCountryData = results[currentSelectedCountry];
      const newPieData = Object.keys(newCountryData.categoryBreakdown).map(
        (categoryName) => {
          return {
            name: categoryName,
            value: newCountryData.categoryBreakdown[categoryName],
          };
        }
      );
      setCurrentCountryData(newCountryData);
      setCurrentCountryMetadata(countries[currentSelectedCountry]);
    });

  //whenever current country data score breakdown changes, update the per-dataset jsx tables
  useConditionalEffect(
    [currentSelectedCountryData?.scoreBreakdown],
    () => {
      // console.log('might update per dataset jsx tables here...', currentSelectedCountryData, datasets);
      if (
        !currentSelectedCountryData ||
        !currentSelectedCountryData.scoreBreakdown ||
        !datasets
      )
        return;
      // console.log('WILL update per dataset jsx tables now...');
      //! important variable here, determines how often ads are inserted
      const datasetsPerAd: number = 4;
      const scoreBreakdown = currentSelectedCountryData!.scoreBreakdown;

      const newDetailedTables = []; // <Table elements holding 4 rows, with ads inserted between each table elemment
      //make list of all rows to go into the tables
      const allRows = Object.keys(scoreBreakdown).map((datasetID) => {
        const thisDataset = scoreBreakdown[datasetID];
        return [
          <div style={{ width: "30vw" }}>
            {datasets![datasetID].long_name}
          </div>,
          thisDataset.score.toFixed(0),
          thisDataset.rank,
          thisDataset.percentile.toFixed(0),
          thisDataset.dataWasMissing ? "Yes" : "No",
        ];
      });
      console.log('done making all rows', allRows);
      //determine how many tables of 'datasetsPerAd' or less rows there needs to be
      const numberOfTables: number = (allRows.length > datasetsPerAd) ?
        (allRows.length * 1.0) / datasetsPerAd +
        (allRows.length % datasetsPerAd > 0 ? 1 : 0)
        : 1;
      // console.log('going to make tables now, with ', numberOfTables);

      for (let i = 0; i < numberOfTables; i++) {
        let rowsForTable: any[] = [];
        if (allRows.length === 1) {
          rowsForTable = allRows;
        } else if (allRows.length < datasetsPerAd) {
          rowsForTable = allRows;
        } else {
          rowsForTable = allRows.slice(i * datasetsPerAd, i * datasetsPerAd + datasetsPerAd);
        }
        console.log('rows for table ', rowsForTable);
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
        newDetailedTables.push(ads[i] ? <Ad key={'ads[i]'}>{ads[i]}</Ad> : <></>); //ad
      }
      // console.log('setting detailed tables elements to...',newDetailedTables);
      setDetailedTables(newDetailedTables);
    });

  const endAds = useCallback(
    (numberOfDatasets: number) => {
      //assuming an insertion ratio of 1 ad to 4 datasets
      return ads.slice(numberOfDatasets / 4 - 1);
    },
    [ads]
  ); //these are the ads that WONT be inserted within the datasets breakdown
  //because there are not enough datasets

  if (!currentSelectedCountryData || !datasets || !currentSelectedCountryMetadata) {
    return <div>Loading country data...</div>;
  } else {
    return (
      <Container>
        {/* <UpperFixedHeightContainer> */}
        <TitleContainer>
          <h1>{currentSelectedCountryData.primary_name.toUpperCase()}</h1>
          <Flag
            code={currentSelectedCountryMetadata.alpha_three_code}
            style={{ width: "30%" }}
          />
        </TitleContainer>
        <VariableContainer>
          <SummaryContainer>
            <SummaryItem>
              <BoldP>
                Overall Ranking
              </BoldP>
              <Paragraph>{currentSelectedCountryData.rank}</Paragraph>
            </SummaryItem>
            <SummaryItem>
              <BoldP>
                Total Score:
              </BoldP>
              <Paragraph>{currentSelectedCountryData.totalScore.toFixed(0)}</Paragraph>
            </SummaryItem>
            <SummaryItem>
              <BoldP>
                Percentile:
              </BoldP>
              <Paragraph>{currentSelectedCountryData.percentile.toFixed(0)}</Paragraph>
            </SummaryItem>
          </SummaryContainer>
          <WikiButton
            onClick={() =>
              window.open(
                `https://wikipedia.org/wiki/${currentSelectedCountryData.primary_name.replace(
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
          <Map locationName={currentSelectedCountryMetadata.primary_name} />
        </MapContainer>
        <ExpandedLowerArea>
          <SubTitle>CATEGORY BREAKDOWN</SubTitle>
          <CategoryBreakdowns>
            {Object.keys(currentSelectedCountryData.categoryBreakdown).map(
              (categoryName) => {
                return (
                  <CategoryBreakdown key={categoryName}>
                    {categoryName.toUpperCase()}:{" "}
                    {currentSelectedCountryData.categoryBreakdown[categoryName].toFixed(
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
            {endAds(Object.keys(currentSelectedCountryData.scoreBreakdown).length).map(
              (ad) => {
                if (!ad) return <></>;
                return <Ad key={ad}>{ad}</Ad>;
              }
            )}
          </DatasetBreakdowns>
        </ExpandedLowerArea>
      </Container>
    );
  }
};

export default CountryBreakdownPopup;
//
