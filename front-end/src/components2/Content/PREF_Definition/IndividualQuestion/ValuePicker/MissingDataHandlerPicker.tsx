import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Form, FormGroup} from 'react-bootstrap';

export interface MissingDataHandlerPickerProps{
    Explanation: JSX.Element,
    setMissingDataHandlerMethod (newVal: string): void,
    setMissingDataHandlerInput (newVal: number): void,
    getMissingDataHandlerMethod ():string,
    getMissingDataHandlerInput ():number,
    missingDataHandlerMethods: {name: string, needsInput: boolean}[],
}
const MissingDataHandlerPicker: React.FunctionComponent<MissingDataHandlerPickerProps> =({
    Explanation,
    getMissingDataHandlerMethod,
    setMissingDataHandlerMethod,
    getMissingDataHandlerInput,
    setMissingDataHandlerInput,
    missingDataHandlerMethods,
})=> {
const currentMethodNeedsInput = ()=>{
    const currentMethod = getMissingDataHandlerMethod();
    const currentMethodMetadata = missingDataHandlerMethods.filter((item)=>item.name===currentMethod)[0];
    return currentMethodMetadata.needsInput;
}
return (
<Container>
    <Form.Label>Method For Handling Missing Data:</Form.Label>
    <FormGroup>
        <Form.Control as="select" defaultValue={getMissingDataHandlerMethod()} size="lg" onChange={(e)=>setMissingDataHandlerMethod(e.target.value)}>
            {missingDataHandlerMethods.map(method=>{
                return <option key={method.name} value={method.name}>{method.name}</option>
            })}
        </Form.Control>
    </FormGroup>
    <Form.Label>Input, if neccessary, for the above Method:</Form.Label>
    <FormGroup>
        <Form.Control disabled={!currentMethodNeedsInput()} as="input" defaultValue={getMissingDataHandlerInput()} size="lg" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setMissingDataHandlerInput(e.target.valueAsNumber)}>
        </Form.Control>
    </FormGroup>
    {Explanation}
</Container>
);
}
export default MissingDataHandlerPicker;
