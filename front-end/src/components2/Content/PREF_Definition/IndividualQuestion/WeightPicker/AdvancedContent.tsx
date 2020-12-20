import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Form } from 'react-bootstrap';

export interface WeightAdvancedContentProps{
    weightRange: {min: number, max: number},
    getWeight ():number,
    setWeight (weight: number): void,
}
const WeightAdvancedContent: React.FunctionComponent<WeightAdvancedContentProps> =({weightRange, getWeight, setWeight})=> {

return (
<Container>
    <h4>Select an exact Weight value for this question:</h4>
    <Form.Group>
        <Form.Label>Exact Weight: {getWeight()}</Form.Label>
        <Form.Control type="range" defaultValue={getWeight()} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setWeight(e.target.valueAsNumber)}></Form.Control>
    </Form.Group>
    <h5>If you select a weight of "0" this question will not be counted at all.</h5>
    <h5>*Each country's score for this question is multiplied by the weight value you supply here.
        In other words a question with a weight of 2 will have twice the impact on your final results
        as a question with a weight of 1. 
    </h5>
</Container>
);
}
export default WeightAdvancedContent;
