import React, { useState, useContext, useCallback, useEffect } from 'react';
import styled, { keyframes, ThemeContext } from 'styled-components';
import IdealValuePicker from './IdealValuePicker';
import NormalizationPicker from './NormalizationPicker';
import QuestionContainer from './QuestionContainer';
import WeightPicker from './WeightPicker';
import MissingDataHandlerPicker from './MissingDataHandlerPicker';
import { Ring } from 'react-spinners-css';
import DatasetNotes from './DatasetNotes';
import QuestionaireLogicProvider, { QuestionaireLogicContext } from './QuestionaireLogicProvider';
import { AnswersContext } from '../containers/AnswersProvider';
import { VerticalFlexBox, H3, HorizontalFlexBox } from "../../reusable-styles";
import Container from 'react-bootstrap/Container';

const QuestionText = styled.h3`
    font-size: ${props => props.theme.font4};
    font-family: ${props => props.theme.fontFamHeader};
    padding: 0 3rem;
`;

const AdvancedOptionsTitle = styled.h4`
    ${H3};
    margin: 1rem;
    font-family: ${props => props.theme.fontFamHeader};
`;
const LoadingContainer = styled.div`
    ${VerticalFlexBox};
    width: 100%;
    height: 100%;
`;


const Triangle = styled.div`
    width: 0;
    height: 0;
    border-left: 1rem solid transparent;
    border-right: 1rem solid transparent;
    border-bottom: 1rem solid ${props => props.color};
    position: absolute;
    top: -1rem;
    right: 32vw;
    z-index: 5;
    @media (max-width: ${props => props.theme.largerBreakpoint}px){
        right: 48vw;
    }

`;

const SwiperContainer = styled.div`
    ${HorizontalFlexBox}
    background: ${props => props.theme.primaryGradient};
    height: 60vh;
    margin-top: 6rem;
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
const InnerContainer = styled.div`
height: 95%;
margin: auto;
width: 95%;
position: relative;
`;

interface QuestionSwiperProps {
}
const QuestionSwiper: React.FunctionComponent<QuestionSwiperProps> = () => {
    const theme = useContext(ThemeContext);
    const qc = useContext(QuestionaireLogicContext);
    const currentDataset = qc.currentDataset;
    const fc = useContext(AnswersContext);
    const allAnswers = fc.currentAnswers;

    return (
        <SwiperContainer>
            <Triangle color={theme.primaryAccent} />
            <InnerContainer>
                {(currentDataset && currentDataset.id && allAnswers) ?
                    <QuestionContainer>
                        <QuestionText>What <b>{currentDataset.long_name}</b> would you like your country to have?</QuestionText>
                        <IdealValuePicker />
                        <WeightPicker />
                        <AdvancedOptionsTitle>Advanced Options</AdvancedOptionsTitle>
                        <MissingDataHandlerPicker />
                        <NormalizationPicker />
                        <DatasetNotes />
                    </QuestionContainer>
                    : <LoadingContainer><Ring color={theme.white} size={80} /></LoadingContainer>}
            </InnerContainer>
        </SwiperContainer>
    );
}
export default QuestionSwiper;
