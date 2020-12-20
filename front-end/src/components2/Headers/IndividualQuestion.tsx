import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Form, FormGroup, } from 'react-bootstrap';
import { ViewObjectProps } from '../Layout';

export interface IndividualQuestionSpecificHeaderProps{
    questionsInThisCategory: ViewObjectProps[],
    currentQuestion: number,
    onChange: any,
}
const IndividualQuestionSpecificHeader: React.FunctionComponent<IndividualQuestionSpecificHeaderProps> =({
    questionsInThisCategory,
    onChange,
    currentQuestion,
})=> {

return (
<Container>
    <Form.Label>Current Question:</Form.Label>
    <FormGroup>
        <Form.Control as="select" defaultValue={currentQuestion} size="lg" onChange={onChange}>
            {questionsInThisCategory.map(question=>{
                return <option key={question.id} value={question.id}>{question.id}. {question.text}</option>
            })}
        </Form.Control>
    </FormGroup>

</Container>
);
}
export default IndividualQuestionSpecificHeader;
