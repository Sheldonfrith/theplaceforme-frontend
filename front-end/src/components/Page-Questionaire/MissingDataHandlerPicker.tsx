import { Info } from '@material-ui/icons';
import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import InfoPopup from './InfoPopup';
import {Container, MainTextArea} from './DataInputContainer';

interface MissingDataHandlerPickerProps{

}
const MissingDataHandlerPicker: React.FunctionComponent<MissingDataHandlerPickerProps> =({})=> {
const gc = useContext(GlobalContext);
const methods = gc.missingDataHandlerMethods;
const [selectedMethod, setSelectedMethod] = useState<string|null>(null);
const [currentInput, setCurrentInput] = useState<string|null>(null);


return (
<Container>
<MainTextArea>'What method should we use to handle countries with missing data for this question?'</MainTextArea>
{(methods)?
    <select onChange={(e)=>setSelectedMethod(e.target.value)}>
        {Object.keys(methods).map((method: string)=>{
            return <option key={method} value={method}>{methods[method].formattedName}</option>;
        })}
    </select>
:<></>
}
{
    (methods && selectedMethod && methods[selectedMethod].requiresInput)?
        <input type="text" placeholder="Input here for this method..." onChange={(e)=>setCurrentInput(e.target.value)}></input>
    :<></>
}
<InfoPopup>
    <div>
        See our Methodology page for more info about these different methods
        for handling countries with missing data.
    </div>
</InfoPopup>
</Container>
);
}
export default MissingDataHandlerPicker;
