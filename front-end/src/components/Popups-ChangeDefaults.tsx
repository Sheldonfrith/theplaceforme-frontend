import React, { useContext} from 'react';
import styled from 'styled-components';
import {PopupInner, FilledButton, H3,VerticalFlexBox, H1} from './ReusableStyles';
import Select from './reusable/Select';
import {GlobalContext} from './containers/GlobalProvider';
import TextInput from './reusable/TextInput';

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
    <TextInput 
        label="Default Weight:"
        placeholder="default is 0"
        onChange={(e:any)=>gc.setDefaultWeight(e.target.value)}
        value={gc.defaultWeight}
    />
    <SubTitle>Default Missing Data Handler Method:</SubTitle>
    <Select
        optionsList={Object.keys(gc.missingDataHandlerMethods).map(key=>gc.missingDataHandlerMethods![key].formattedName)}
        onChange={(e:any)=>gc.setDefaultMissingDataHandlerMethod(e.target.value)}
    />
    {['worseThanPercentage', 'betterThanPercentage','specificScore','specificValue'].includes(gc.defaultMissingDataHandlerMethod!)?
    <TextInput 
    label="Default Missing Data Handler Input"
    placeholder={'Input for above method...'} 
    onChange={(e:any)=>gc.setDefaultMissingDataHandlerInput(e.target.value)} 
    value={gc.defaultMissingDataHandlerInput || ''}
    />
    :<></>}
    <TextInput 
        label="Default Normalization Percentage"
        placeholder={'0'} 
        onChange={(e:any)=>gc.setDefaultNormalizationPercentage(e.target.value)} 
        value={gc.defaultNormalizationPercentage}
    />
    <ResetButton onClick={()=>gc.setShouldResetFormData(true)}>Save Defaults and Reset Questionaire</ResetButton>
    </>
    )
    :<div>Loading...</div>}
</PopupInnerContainer>
);

}

export default ChangeDefaultsPopup;
