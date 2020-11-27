import React, { useContext, useRef, useEffect} from 'react';
import styled , {Keyframes} from 'styled-components';
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';
import { VerticalFlexBox } from "../../reusable-styles";
const Container = styled.div<{animation: Keyframes}>`
    position: relative;
    background-color: ${props=>props.theme.white};
    ${VerticalFlexBox}
    color: ${props=>props.theme.black};
    margin: auto;
    height: 100%;
    width: 100%;
    overflow: auto;
    position: absolute;
    /* top: 1rem;
    bottom: 1rem;
    right: 1rem;
    left: 1rem; */
    animation: ${props=> props.animation} 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) backwards;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1rem;
`;

interface QuestionContainerProps{
    
}
const QuestionContainer: React.FunctionComponent<QuestionContainerProps> =({children})=> {
    const qc = useContext(QuestionaireLogicContext);
    const animation = qc.questionAnimation!;

//whenever the question changes, scroll to the top of the question container
const scrollTopRef = useRef<HTMLDivElement>(null);
useEffect(()=>{
    if (!scrollTopRef || !scrollTopRef.current) return;
    // @ts-ignore
    scrollTopRef.current.scrollTo(0,0);
},[animation, scrollTopRef]);

return (

<Container animation={animation} ref={scrollTopRef}>
    {children}
</Container>
);
}
export default QuestionContainer;
