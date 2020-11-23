import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

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

const SwiperContainer = styled.div<{ color: string }>`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
    justify-content: space-between;
    background: ${props => props.color};
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
    prevQuestion: any,
    nextQuestion: any,
    backgroundColor: string,
}
const QuestionSwiper: React.FunctionComponent<QuestionSwiperProps> = ({ children, backgroundColor, prevQuestion, nextQuestion }) => {
    const theme = useContext(ThemeContext);
    const handleSwipeLeft = () => {
        prevQuestion();
    }
    const handleSwipeRight = () => {
        nextQuestion();
    }
    return (
        <SwiperContainer color={backgroundColor || theme.red}>
            <Triangle color={theme.primaryAccent} />
            <InnerContainer>

                {children}
            </InnerContainer>
        </SwiperContainer>
    );
}
export default QuestionSwiper;
