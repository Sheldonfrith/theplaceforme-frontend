import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';
import styled from 'styled-components';
import {PopupInner, TransparentButton, H3,VerticalFlexBox, H1} from './ReusableStyles';
import Select from './reusable/Select';
import {GlobalContext} from './containers/GlobalProvider';

//styled components
const PopupInnerContainer = styled.div`${PopupInner}`;
const LogoutButton = styled.button`
${TransparentButton}
background-color: ${props=>props.theme.red};
`;
const Subtitle = styled.h3`${H3}`;
const ChangeDefaultsInfo = styled.div`${VerticalFlexBox}`;
const Title = styled.div`${H1}`;
const InfoText = styled.div`font-size:200%;`;


interface ChangeDefaultsPopupProps{
    closePopup: any,
}
const ChangeDefaultsPopup: React.FunctionComponent<ChangeDefaultsPopupProps>=({closePopup}) =>{
const gc = useContext(GlobalContext);



return (
<PopupInnerContainer>
    <Title>ChangeDefaults</Title>
    {gc.missingDataHandlerMethods?(
    <>
    <div>Default Weight:</div>
    <input type="text" placeholder={'0'} onChange={(e)=>gc.setDefaultWeight(e.target.value)} value={gc.defaultWeight}></input>
    <div>Default Missing Data Handler Method:</div>
    <Select
        optionsList={Object.keys(gc.missingDataHandlerMethods).map(key=>gc.missingDataHandlerMethods![key].formattedName)}
        onChange={(e:any)=>gc.setDefaultMissingDataHandlerMethod(e.target.value)}
    />
    {['worseThanPercentage', 'betterThanPercentage','specificScore','specificValue'].includes(gc.defaultMissingDataHandlerMethod!)?
    <>
    <div>Default Missing Data Handler Input:</div>
    <input type="text" placeholder={'Input for above method...'} onChange={(e)=>gc.setDefaultMissingDataHandlerInput(e.target.value)} value={gc.setDefaultMissingDataHandlerInput}></input>
    </>
    :<></>}
    <div>Default Normalization Percentage:</div>
    <input type="text" placeholder={'0'} onChange={(e)=>gc.setDefaultNormalizationPercentage(e.target.value)} value={gc.setDefaultNormalizationPercentage}></input>
    <button onClick={()=>gc.setShouldResetFormData(true)}>Save Defaults and Reset Questionaire</button>
    </>
    )
    :<div>Loading...</div>}
</PopupInnerContainer>
);

}

export default ChangeDefaultsPopup;
