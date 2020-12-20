
import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Form} from 'react-bootstrap';
import DistributionGraph from './DistributionGraph';

export interface IdealValuePickerProps{
    Explanation: JSX.Element,
    Question: JSX.Element,
    setIdealValue (newVal: number): void,
    getIdealValue ():number,
    distributionMap: number[],
}
const IdealValuePicker: React.FunctionComponent<IdealValuePickerProps> =({
    Explanation,
    Question,
    getIdealValue,
    setIdealValue,
    distributionMap,
})=> {

return (
<Container>
    {Question}
    <Form.Group>
        <DistributionGraph distributionMap={distributionMap} strokeColor={''} fillColor={''}/>
        <Form.Control type="range" defaultValue={getIdealValue()} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setIdealValue(e.target.valueAsNumber)}></Form.Control>
        <Form.Label>Exact Value: {getIdealValue()}</Form.Label>
    </Form.Group>
    {Explanation}
</Container>
);
}
export default IdealValuePicker;
