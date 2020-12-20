import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, FormControl, Form, FormGroup, Button} from 'react-bootstrap';
import {ViewObjectProps} from '../../../core/HelperTypes';

export interface CategoryOverviewContentProps{
    questions: ViewObjectProps[],
    setQuestionsEnabled(newQuestionsEnabled: {[questionID: number]: boolean}):void,
    getQuestionsEnabled():{[questionID: number]: boolean},
}
const CategoryOverviewContent: React.FunctionComponent<CategoryOverviewContentProps> =({questions})=> {

return (
<Container>
    <h2>Select the items below that are important to you...</h2>
    <Form>
        <Form.Group>
            <Button>Select All</Button>
            <Button>Select None</Button>
        </Form.Group>
        <Form.Group>
            {
                questions.map((question: {text:string})=>{
                    return <Form.Check key={question.text} type="checkbox" label={question.text}/>
                })
            }
        </Form.Group>
    </Form>
</Container>
);
}
export default CategoryOverviewContent;
