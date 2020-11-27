import React, { useContext} from 'react';
import styled from 'styled-components';
import {PopupInner, FilledButton, H3,VerticalFlexBox, H1} from '../reusable-styles';
import Select from './reusable/Select';
import {GlobalContext} from './containers/GlobalProvider';
import TextInput from './reusable/TextInput';
import { MissingDataHandlerMethodsContext } from './containers/MissingDataHandlerMethodsProvider';
import { AnswersContext } from "./containers/AnswersProvider";
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
const ac = useContext(AnswersContext);
const mc = useContext(MissingDataHandlerMethodsContext);


return (
<PopupInnerContainer>
    <Title>Change Question Defaults</Title>
    {mc.missingDataHandlerMethods?(
    <>
    <TextInput 
        label="Default Weight:"
        placeholder="default is 0"
        onChange={(e:any)=>ac.setDefaultWeight!(e.target.value)}
        value={ac.defaultWeight}
    />
    <SubTitle>Default Missing Data Handler Method:</SubTitle>
    <Select
        optionsList={Object.keys(mc.missingDataHandlerMethods).map(key=>mc.missingDataHandlerMethods![key].formattedName)}
        onChange={(e:any)=>ac.setDefaultMissingDataHandlerMethod!(e.target.value)}
    />
    {['worseThanPercentage', 'betterThanPercentage','specificScore','specificValue'].includes(ac.defaultMissingDataHandlerMethod!)?
    <TextInput 
    label="Default Missing Data Handler Input"
    placeholder={'Input for above method...'} 
    onChange={(e:any)=>ac.setDefaultMissingDataHandlerInput!(e.target.value)} 
    value={ac.defaultMissingDataHandlerInput || ''}
    />
    :<></>}
    <TextInput 
        label="Default Normalization Percentage"
        placeholder={'0'} 
        onChange={(e:any)=>ac.setDefaultNormalizationPercentage!(e.target.value)} 
        value={ac.defaultNormalizationPercentage}
    />
    <ResetButton onClick={()=>ac.resetAnswers!()}>Save Defaults and Reset Questionaire</ResetButton>
    </>
    )
    :<div>Loading...</div>}
</PopupInnerContainer>
);

}

export default ChangeDefaultsPopup;
