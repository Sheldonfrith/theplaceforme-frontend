import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled, {keyframes} from 'styled-components';
import useMyEffect from '../../lib/Hooks/useMyEffect';

const Container = styled.div<{animation: any}>`
    position: relative;
    background-color: ${props=>props.theme.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
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
    animation: string,
    
}
const QuestionContainer: React.FunctionComponent<QuestionContainerProps> =({children, animation})=> {
    useMyEffect([animation],()=>{console.log('animation changed',animation)},[animation])

//whenever the question changes, scroll to the top of the question container
const scrollTopRef = useRef<HTMLDivElement>(null);
useMyEffect([true],()=>{
    if (!scrollTopRef || !scrollTopRef.current) return;
    // @ts-ignore
    scrollTopRef.current.scrollTo(0,0);
},[animation, scrollTopRef])

return (

<Container animation={animation} ref={scrollTopRef}>
{children}
</Container>
);
}
export default QuestionContainer;
