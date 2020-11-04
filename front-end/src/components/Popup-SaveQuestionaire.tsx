
import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {PopupInner, FilledButton} from './ReusableStyles';
import TextInput from './reusable/TextInput';
import {GlobalContext} from './containers/GlobalProvider';

const PopupInnerContainer = styled.div`${PopupInner}`;
const SaveButton = styled.button`
    ${FilledButton};
`;

interface SaveQuestionairePopupProps{
    closePopup: any,
}
const SaveQuestionairePopup: React.FunctionComponent<SaveQuestionairePopupProps> =({closePopup})=> {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string|null>('');
    const gc = useContext(GlobalContext);

    const saveHandler = useCallback(()=>{
        gc.saveQuestionaire(gc.allFormData,name,description);
        closePopup();
    },[closePopup, gc.saveQuestionaire, gc.allFormData,name,description]);
return (
<PopupInnerContainer>
    <TextInput 
        label="*Name:"
        placeholder="Type name here..."
        value={name}
        onChange={(e:any)=>setName(e.target.value)}
    />
    <TextInput 
        label="Description:"
        placeholder="Type description here..."
        value={description}
        onChange={(e:any)=>setDescription(e.target.value)}
    />
    <SaveButton onClick={saveHandler}>Save Current Questionaire</SaveButton>
</PopupInnerContainer>
);
}
export default SaveQuestionairePopup;
