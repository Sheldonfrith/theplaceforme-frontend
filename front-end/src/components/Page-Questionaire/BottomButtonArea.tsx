import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled, { ThemeContext } from 'styled-components';

import {slideInLeft, slideInRight, slideOutLeft, slideOutRight, TransparentButton, H3, VerticalFlexBox, HorizontalFlexBox}from '../../reusable-styles';
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';

const BottomButtonContainer = styled.div`
    ${HorizontalFlexBox}
    width: 100%;
    padding: 1rem;
    margin: 1rem;
`;
const BottomButton = styled.button`
   ${TransparentButton}
   font-family: ${props=>props.theme.fontFamHeader};
`;

interface BottomButtonAreaProps{

}
const BottomButtonArea: React.FunctionComponent<BottomButtonAreaProps> =()=> {
    const theme = useContext(ThemeContext);
    const qc = useContext(QuestionaireLogicContext);
    const getBottomButtonText = (): string[] =>{
        //based on media query make bottom buttons either <> or prev/next
        var width = window.matchMedia(`(max-width: ${theme.primaryBreakpoint}px)`);
        if (width.matches){
            return ['<', '>'];
        } else {
            return ['Previous', 'Next'];
        }
    }
    const [bottomButtonText, setBottomButtonText]= useState<string[]>(getBottomButtonText());//[0] is back button, [1] is forward button

return (
<BottomButtonContainer>
        <BottomButton onClick={(e)=>qc.prevQuestion!()}>{bottomButtonText[0]}</BottomButton>
        <BottomButton onClick={(e)=>qc.nextQuestion!()}>{bottomButtonText[1]}</BottomButton>
        <BottomButton onClick={(e)=>qc.finishQuestionaire!()}>Submit Now</BottomButton>
    </BottomButtonContainer>
);
}
export default BottomButtonArea;
