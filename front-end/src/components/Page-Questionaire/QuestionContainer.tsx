import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled, {keyframes} from 'styled-components';
import useMyEffect from '../../lib/Hooks/useMyEffect';

const Container = styled.div<{animation: any}>`
    position: relative;
    background-color: ${props=>props.theme.darkOverlay};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: ${props=>props.theme.white};
    margin: auto;
    height: 100%;
    width: 100%;
    overflow: auto;
    position: relative;
    animation: ${props=> props.animation} 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1rem;
`;

interface QuestionContainerProps{
    animation: string
}
const QuestionContainer: React.FunctionComponent<QuestionContainerProps> =({children, animation})=> {
    useMyEffect([animation],()=>{console.log('animation changed',animation)},[animation])
return (

<Container animation={animation}>
{children}
</Container>
);
}
export default QuestionContainer;
