import React, { useState, useContext, useCallback } from "react";
import { GlobalContext } from "./containers/GlobalProvider";
import Header from "./Header";
import styled, { ThemeContext } from "styled-components";
import {
  PageContainer,
  FilledButton,
  H1,
  HorizontalFlexBox,
  VerticalFlexBox,
} from "./ReusableStyles";
import getColorFromPercentile from "../lib/UI-Constants/rankColors";
import { toTitleCase } from "../lib/Utils";
import { Help } from "@material-ui/icons";
import useMyEffect from "../lib/Hooks/useMyEffect";
import { Ring } from "react-spinners-css";

const Container = styled.div`
  ${PageContainer};
  background-image: ${(props) => props.theme.primaryLightBackground};
  color: ${(props) => props.theme.black};
`;
const LoadingContainer = styled.div`
  ${VerticalFlexBox};
  width: 100%;
  height: 100%;
`;

const BackButton = styled.button`
  ${FilledButton};
  background-color: ${(props) => props.theme.black};
`;
const BottomButton = styled.button`
  ${FilledButton};
  background-color: ${(props) => props.theme.black};
  margin: 2vw;
`;
const SubTitle = styled.h2`
  ${H1}
`;

const BottomButtonsContainer = styled.div`
  ${HorizontalFlexBox};
  width: 100%;
  justify-content: space-evenly;
  margin: 2vw;
`;

const ResultsContainer = styled.div`
  ${VerticalFlexBox};
  overflow: auto;
  width: 90%;
  margin: 0 0 0 0;
  box-shadow: inset 1px 3px 7px 2px rgb(50, 0, 0, 0.8);
  padding: 1rem;
  background: ${(props) => props.theme.primaryGradient};
  border-radius: 0.3rem;
`;

const CountryResult = styled.div`
  ${HorizontalFlexBox};
  width: 99%;
  cursor: pointer;
  border: solid 0.3rem;
  box-sizing: border-box;
  background: none;
  margin: 0.2rem;
  font-size: ${(props) => props.theme.font6};
  background-color: white;
  border-radius: 0.3rem;
  box-shadow: 1px 0.5px 2px 0.5px black;
  :hover {
    box-shadow: 1px 1px 2px 1px black;
  }
`;
const CountryName = styled.div`
  ${HorizontalFlexBox};
  font-size: ${(props) => props.theme.font6};
  width: 100%;
  text-align: left;
  margin: 1rem;
`;

const CountryResultNumber = styled.div`
  ${VerticalFlexBox};
  width: 12%;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem 2rem;
  color: white;
  text-shadow: 1px 1px black;
  box-shadow: 0 0 2px 2px $;
`;

const HelpContainer = styled.div`
  ${VerticalFlexBox};
  font-size: inherit;
  margin: 1rem;
`;

interface ResultsPageProps {}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () => {
  const gc = useContext(GlobalContext);
  const theme = useContext(ThemeContext);
  const [scoreRange, setScoreRange] = useState<Array<number> | null>(null); // index 0 is min score, index 1 is max score
    const [retryScoreRangeCount, setRetryScoreRangeCount] = useState<number>(5);

    const updateScoreRange = useCallback(()=>{
        if (!gc.results) return;
        let min = Infinity;
        let max = 0;
        Object.keys(gc.results).forEach((countryCode) => {
          const thisScore = gc.results![countryCode].totalScore;
          if (thisScore > max) {
            max = thisScore;
          }
          if (thisScore < min) {
            min = thisScore;
          }
        });
        setScoreRange([min, max]);
    },[gc.results, setScoreRange])

  //update score range whenever gc.results change
  useMyEffect(
    [true],
    () => {
     updateScoreRange();
    },
    [updateScoreRange]
  );

  const getSortedCountryIDs = () =>
    gc.results
      ? Object.keys(gc.results).sort(
          (a, b) => gc.results![a].rank - gc.results![b].rank
        )
      : null;

  return (
    <Container>
      <Header textColor={theme.black} />
      <SubTitle>RESULTS</SubTitle>
      <ResultsContainer>
        {gc.results && getSortedCountryIDs() && scoreRange ? (
          getSortedCountryIDs()!.map((countryCode) => {
            const country = gc.results![countryCode];
            const scorePercentile =
              ((country.totalScore - scoreRange![0]) /
                (scoreRange![1] - scoreRange![0])) *
              100.0;
            if (scorePercentile > 100 || scorePercentile < 0)
            {
                if (retryScoreRangeCount ===0){
                    throw new Error(
                      "score percentile out of the 0-100 range... percentile..." +
                        scorePercentile +
                        " countryscore... " +
                        country.totalScore +
                        " scorerange... " +
                        scoreRange
                    );
                } else {
                    //update scoreRange and try again
                    updateScoreRange();
                    setRetryScoreRangeCount(prev=>prev-1);
                }
            }
            const color = getColorFromPercentile(scorePercentile);
            return (
              <CountryResult
                key={country.primary_name}
                style={{ borderColor: color }}
                onClick={() => {
                  gc.setCurrentCountry(countryCode);
                  gc.setCurrentPopup("countryBreakdown");
                }}
              >
                <CountryResultNumber
                  style={{
                    background: color,
                    boxShadow: `0 0 2px 2px ${color}`,
                  }}
                >
                  {country.rank}.
                </CountryResultNumber>
                <CountryName>{toTitleCase(country.primary_name)}</CountryName>
                <HelpContainer>
                  <Help fontSize={"inherit"} />
                </HelpContainer>
              </CountryResult>
            );
          })
        ) : (
          <LoadingContainer>
            <Ring color={theme.white} size={80} />
          </LoadingContainer>
        )}
      </ResultsContainer>
      <BottomButtonsContainer>
        <BottomButton onClick={(e) => gc.setCurrentPage("questionaire")}>
          Back to Questions
        </BottomButton>
        <BottomButton
          onClick={() => window.alert("Share feature coming soon...")}
        >
          Share
        </BottomButton>
        <BottomButton
          onClick={() => window.alert("Save feature coming soon...")}
        >
          Save
        </BottomButton>
      </BottomButtonsContainer>
    </Container>
  );
};

export default ResultsPage;
