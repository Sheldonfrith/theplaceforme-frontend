import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background-color: ${props=>props.theme.black}
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

interface QuestionContainerProps{

}
const QuestionContainer: React.FunctionComponent<QuestionContainerProps> =({children})=> {

return (
<div>
{children}
</div>
);
}
export default QuestionContainer;
