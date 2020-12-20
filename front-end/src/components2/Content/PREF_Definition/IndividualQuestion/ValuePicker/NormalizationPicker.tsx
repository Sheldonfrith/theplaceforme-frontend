import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Form} from 'react-bootstrap';

export interface NormalizationPickerProps{
    Explanation: JSX.Element,
    setNormalization (newVal: number): void,
    getNormalization ():number,
}
const NormalizationPicker: React.FunctionComponent<NormalizationPickerProps> =({
    Explanation,
    getNormalization,
    setNormalization,
})=> {

return (
<Container>
    <Form.Group>
        <Form.Control type="range" defaultValue={getNormalization()} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setNormalization(e.target.valueAsNumber)}></Form.Control>
        <Form.Label>Exact Value: {getNormalization()}</Form.Label>
    </Form.Group>
    {Explanation}
</Container>
);
}
export default NormalizationPicker;
