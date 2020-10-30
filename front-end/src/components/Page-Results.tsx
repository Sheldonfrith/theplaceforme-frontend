import React, {useState, useEffect, useContext, useCallback} from 'react';
import { GlobalContext } from './containers/GlobalProvider';
import Header from './Header';
import styled ,{ThemeContext} from 'styled-components';
import {PageContainer, TransparentButton, FilledButton, H2, HorizontalFlexBox, VerticalFlexBox} from './ReusableStyles';
import getColorFromPercentile from '../lib/UI-Constants/rankColors';
import {toTitleCase} from '../lib/Utils';
import {Help} from '@material-ui/icons';
import useMyEffect from '../lib/Hooks/useMyEffect';

const Container = styled.div`
    ${PageContainer};
    background-image: radial-gradient(50% 50% at 50% 50%, ${props=>props.theme.white} 0%, ${props=>props.theme.yellow} 100%);
    color: ${props=>props.theme.black};
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
    ${H2}
`;

const BottomButtonsContainer = styled.div`
    ${HorizontalFlexBox};
    width:100%;
    justify-content: space-evenly;
`;

const ResultsContainer = styled.div`
    ${VerticalFlexBox};
    overflow: auto;
    width:100%;
`;


const CountryResult = styled.div.attrs(props=>({
    style:{
        borderColor: props.color,
    },
    }))`
    ${HorizontalFlexBox};
    width: 100%;
    cursor: pointer;
    border: solid 0.2rem;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 200%;
    background: none;
    margin: 0.2rem;
    background-color: ${props=>props.theme.whiteOverlay};
`;
const CountryResultNumber = styled.div.attrs(props=>({
    style:{
    backgroundImage: `linear-gradient(180deg, rgb(0,0,0,0) 0%, ${props.color} 100%)`,
    },
}))`
    ${VerticalFlexBox};
    width:  15%;
    height: 65%;
    padding: 1rem;
`;

const HelpContainer = styled.div`
    ${VerticalFlexBox}
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
    let min =0;
    let max= 0;
    Object.keys(gc.results).forEach(countryCode=>{
        const thisScore = gc.results![countryCode].totalScore;
        if (thisScore > max){
            max = thisScore;
        }
        if (thisScore <min){
            min = thisScore;
        }
    });
    setScoreRange([min,max]);
},[gc.results])

const getSortedCountryIDs =()=> gc.results?Object.keys(gc.results).sort((a,b)=> gc.results![a].rank - gc.results![b].rank):null;

return (
<Container>
    <Header textColor={theme.black}/>
    <BackButton onClick={(e)=>gc.setCurrentPage('questionaire')}>Back to Questions</BackButton>
    <SubTitle>Your Results:</SubTitle>
    <ResultsContainer>
        {(gc.results && getSortedCountryIDs() && scoreRange)?
            getSortedCountryIDs()!.map((countryCode)=>{
            const country = gc.results![countryCode];
            const color = getColorFromPercentile((country.totalScore/(scoreRange![1]-scoreRange![0]))*100.0);
            return (
            <CountryResult key={country.primary_name} color={color} onClick={()=>{
                gc.setCurrentCountry(countryCode);gc.setCurrentPopup('countryBreakdown');}
            }>
                <CountryResultNumber color={color}>
                    {country.rank}.
                </CountryResultNumber>
                {toTitleCase(country.primary_name)}
                <HelpContainer>
                <Help fontSize={'inherit'}/>

                </HelpContainer>
            </CountryResult>
            );
            })
        :'loading results...'}
    </ResultsContainer>
    <BottomButtonsContainer>
    <BottomButton onClick={()=>window.alert('Share feature coming soon...')}>Share</BottomButton>
    <BottomButton onClick={()=>window.alert('Save feature coming soon...')}>Save</BottomButton>
    </BottomButtonsContainer>
</Container>
);
}

export default ResultsPage;