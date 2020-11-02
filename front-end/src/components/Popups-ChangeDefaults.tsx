import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';
import styled from 'styled-components';
import {PopupInner, TransparentButton, FilledButton, H3,VerticalFlexBox, H1} from './ReusableStyles';
import Select from './reusable/Select';
import {GlobalContext} from './containers/GlobalProvider';

//styled components
const PopupInnerContainer = styled.div`${PopupInner}`;

const SubTitle = styled.div`
    ${H3};
`;
const ChangeDefaultsInfo = styled.div`${VerticalFlexBox}`;
const Title = styled.div`${H1}`;
const InfoText = styled.div`font-size:200%;`;
const ResetButton = styled.button`
    ${FilledButton};
`;

interface ChangeDefaultsPopupProps{
    closePopup: any,
}
const ChangeDefaultsPopup: React.FunctionComponent<ChangeDefaultsPopupProps>=({closePopup}) =>{
const gc = useContext(GlobalContext);



return (
<PopupInnerContainer>
    <Title>Change Question Defaults</Title>
    {gc.missingDataHandlerMethods?(
    <>
    <SubTitle>Default Weight:</SubTitle>
    <input type="text" placeholder={'0'} onChange={(e)=>gc.setDefaultWeight(e.target.value)} value={gc.defaultWeight}></input>
    <SubTitle>Default Missing Data Handler Method:</SubTitle>
    <Select
        optionsList={Object.keys(gc.missingDataHandlerMethods).map(key=>gc.missingDataHandlerMethods![key].formattedName)}
        onChange={(e:any)=>gc.setDefaultMissingDataHandlerMethod(e.target.value)}
    />
    {['worseThanPercentage', 'betterThanPercentage','specificScore','specificValue'].includes(gc.defaultMissingDataHandlerMethod!)?
    <>
    <SubTitle>Default Missing Data Handler Input:</SubTitle>
    <input type="text" placeholder={'Input for above method...'} onChange={(e)=>gc.setDefaultMissingDataHandlerInput(e.target.value)} value={gc.defaultMissingDataHandlerInput}></input>
    </>
    :<></>}
    <div>Default Normalization Percentage:</div>
    <input type="text" placeholder={'0'} onChange={(e)=>gc.setDefaultNormalizationPercentage(e.target.value)} value={gc.defaultNormalizationPercentage}></input>
    <ResetButton onClick={()=>gc.setShouldResetFormData(true)}>Save Defaults and Reset Questionaire</ResetButton>
    </>
    )
    :<div>Loading...</div>}
</PopupInnerContainer>
);

}

export default ChangeDefaultsPopup;
