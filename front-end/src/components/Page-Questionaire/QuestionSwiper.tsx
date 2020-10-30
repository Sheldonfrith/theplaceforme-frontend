import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import Swipe from 'react-easy-swipe';

const Triangle = styled.div`
    width: 0;
    height: 0;
    border-left: 1rem solid transparent;
    border-right: 1rem solid transparent;
    border-bottom: 1rem solid ${props=>props.color};
    position: absolute;
    top: -1rem;
    right: 38vw;
    z-index: 5;

`;

const SwiperContainer = styled.div<{color:string}>`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.color};
    height: 70vh;
    margin-top: 6rem;
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

interface QuestionSwiperProps{
    prevQuestion: any,
    nextQuestion: any,
    backgroundColor: string,
}
const QuestionSwiper: React.FunctionComponent<QuestionSwiperProps> =({children, backgroundColor, prevQuestion, nextQuestion})=> {

const handleSwipeLeft= ()=>{
    prevQuestion();
    //if there is no question or category previous, then do nothing
    //if on question 0, but with category previous
        //then go to previous category, but still trigger the question animations
    //if normal then trigger an out-left animation on current question
    //then change question with immediate in-from-right on next question
}
const handleSwipeRight= ()=>{
    nextQuestion();
    //if there is no question or category after, then go to results (with a prompt to ask?)
    //if on last question but there is another category
        //then go to next category, but still trigger the question animations
    //if normal then trigger an out-right animation on current question
    //then change question with immediate in-from-left on next questionc
}
return (
<SwiperContainer color={backgroundColor}>
    <Triangle color={backgroundColor}/>
{/* <Swipe
    onSwipeLeft={handleSwipeLeft}
    onSwipeRight={handleSwipeRight}
    tolerance={5}
    allowMouseEvents
    innerRef={()=>null}
    style={{
        height: '95%',
        margin: 'auto',
        width: '95%',
        position: 'relative',
    }}
> */}
<div style={{
        height: '95%',
        margin: 'auto',
        width: '95%',
        position: 'relative',
    }}>

    {children}
</div>
{/* </Swipe> */}
</SwiperContainer>
);
}
export default QuestionSwiper;
