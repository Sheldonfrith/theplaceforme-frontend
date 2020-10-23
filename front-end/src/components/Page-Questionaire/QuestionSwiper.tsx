import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';

const SwiperContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

interface QuestionSwiperProps{
    setCurrentQuestion: any,
    currentQuestion: string | null,
}
const QuestionSwiper: React.FunctionComponent<QuestionSwiperProps> =({children, setCurrentQuestion, currentQuestion})=> {

return (
<SwiperContainer>
    {children}
</SwiperContainer>
);
}
export default QuestionSwiper;
