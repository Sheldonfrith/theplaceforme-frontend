import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled, {ThemeContext} from 'styled-components';
import {Ring} from 'react-spinners-css';
import {PageContainer} from '../reusable-styles';

const Container = styled.div`
    ${PageContainer};
    justify-content: center;
`;

interface LoadingPageProps{

}
const LoadingPage: React.FunctionComponent<LoadingPageProps> =()=> {
    const theme = useContext(ThemeContext);

return (
<Container>
    <Ring color={theme.primaryAccent} size={80}/>
</Container>
);
}
export default LoadingPage;
