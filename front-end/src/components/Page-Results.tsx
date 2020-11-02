import React, {useState, useEffect, useContext, useCallback} from 'react';
import { GlobalContext } from './containers/GlobalProvider';
import Header from './Header';
import styled ,{ThemeContext} from 'styled-components';
import {PageContainer, TransparentButton, FilledButton, H1, HorizontalFlexBox, VerticalFlexBox} from './ReusableStyles';
import getColorFromPercentile from '../lib/UI-Constants/rankColors';
import {toTitleCase} from '../lib/Utils';
import {Help} from '@material-ui/icons';
import useMyEffect from '../lib/Hooks/useMyEffect';
import {Ring} from 'react-spinners-css';

const Container = styled.div`
    ${PageContainer};
    background-image: ${props=>props.theme.primaryLightBackground};
    color: ${props=>props.theme.black};
`;
const LoadingContainer = styled.div`
    ${VerticalFlexBox};
    width: 100%;
    height: 100%;
`;

const BackButton = styled.button`
    ${FilledButton};
    background-color: ${props=>props.theme.black};
`;
const BottomButton = styled.button`
    ${FilledButton};
    background-color: ${props=>props.theme.black};
`;
const SubTitle = styled.h2`
    ${H1}
`;

const BottomButtonsContainer = styled.div`
    ${HorizontalFlexBox};
    width:100%;
    justify-content: space-evenly;
    margin: 2rem;
`;

const ResultsContainer = styled.div`
    ${VerticalFlexBox};
    overflow: auto;
    width:90%;
    margin: 0 0 1.2srem 0;
`;


const CountryResult = styled.div`
    ${HorizontalFlexBox};
    width: 100%;
    cursor: pointer;
    border: solid 0.2rem;
    box-sizing: border-box;
    background: none;
    margin: 0.2rem;
    font-size: ${props=>props.theme.font6};
    background-color: ${props=>props.theme.whiteOverlay};
    :hover{
        background: white;
    }
`;
const CountryName = styled.div`
    ${HorizontalFlexBox};
    font-size: ${props=>props.theme.font6};
    width: 100%;
    text-align: left;
    margin: 1rem;
`;

const CountryResultNumber = styled.div`
    ${VerticalFlexBox};
    width:  15%;
    height: 65%;
    padding: 1rem;
`;

const HelpContainer = styled.div`
    ${VerticalFlexBox};
    font-size:inherit;
    margin: 1rem;
`;


interface ResultsPageProps {
    
}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () =>{
const gc = useContext(GlobalContext);
const theme = useContext(ThemeContext);
const [scoreRange, setScoreRange]= useState<Array<number>|null>(null); // index 0 is min score, index 1 is max score
//update score range whenever gc.results change
useMyEffect([gc.results],()=>{
    if (!gc.results) return;
    let min =Infinity;
    let max= 0;
    Object.keys(gc.results).forEach(countryCode=>{
        const thisScore = gc.results![countryCode].totalScore;
        if (thisScore > max){
            max = thisScore;
        }
        if (thisScore < min){
            min = thisScore;
        }
    });
    setScoreRange([min,max]);
},[gc.results])

const getSortedCountryIDs =()=> gc.results?Object.keys(gc.results).sort((a,b)=> gc.results![a].rank - gc.results![b].rank):null;

return (
<Container>
    <Header textColor={theme.black}/>
    <SubTitle>RESULTS</SubTitle>
    <ResultsContainer>
        {(gc.results && getSortedCountryIDs() && scoreRange)?
            getSortedCountryIDs()!.map((countryCode)=>{
                const country = gc.results![countryCode];
                const scorePercentile = ((country.totalScore-scoreRange![0])/(scoreRange![1]-scoreRange![0]))*100.0;
                if (scorePercentile >100 || scorePercentile <0) throw new Error('score percentile out of the 0-100 range... percentile...'+scorePercentile+' countryscore... '+country.totalScore+' scorerange... '+scoreRange)
                const color = getColorFromPercentile(scorePercentile);
                return (
                    <CountryResult key={country.primary_name} style={{borderColor: color}} onClick={()=>{
                        gc.setCurrentCountry(countryCode);
                        gc.setCurrentPopup('countryBreakdown');
                    }
                }>
                <CountryResultNumber style={{
                    backgroundImage: `linear-gradient(180deg, rgb(0,0,0,0) 0%, ${color} 100%)`,
                }}>
                    {country.rank}.
                </CountryResultNumber>
                <CountryName>

                {toTitleCase(country.primary_name)}
                </CountryName>
                <HelpContainer>
                <Help fontSize={'inherit'}/>

                </HelpContainer>
            </CountryResult>
            );
        })
        :<LoadingContainer><Ring color={theme.white} size={80}/></LoadingContainer>}
    </ResultsContainer>
    <BottomButtonsContainer>
        <BackButton onClick={(e)=>gc.setCurrentPage('questionaire')}>Back to Questions</BackButton>
    <BottomButton onClick={()=>window.alert('Share feature coming soon...')}>Share</BottomButton>
    <BottomButton onClick={()=>window.alert('Save feature coming soon...')}>Save</BottomButton>
    </BottomButtonsContainer>
</Container>
);
}

export default ResultsPage;