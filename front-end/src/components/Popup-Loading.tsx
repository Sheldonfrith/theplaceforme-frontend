import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled, {ThemeContext} from 'styled-components';
import {PopupInner} from './ReusableStyles';
import {Ring} from 'react-spinners-css';

const PopupInnerContainer = styled.div`
${PopupInner}
justify-content: center;
`;

interface LoadingPopupProps{

}
const LoadingPopup: React.FunctionComponent<LoadingPopupProps> =({})=> {
    const theme = useContext(ThemeContext);
return (
<PopupInnerContainer>
    <Ring color={theme.primaryAccent} size={80}/>
</PopupInnerContainer>
);
}
export default LoadingPopup;
