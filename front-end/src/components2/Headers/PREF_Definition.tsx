import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Form, FormGroup, Container}from 'react-bootstrap';
import {ViewObjectProps}from '../Layout';


export interface PREF_DefinitionHeaderProps{
    categories: ViewObjectProps[],
    currentCategory: number,
    onChange: any,
}
const PREF_DefinitionHeader: React.FunctionComponent<PREF_DefinitionHeaderProps> =({categories, currentCategory, onChange})=> {
//ONLY SHOULD BE USED IF VIEWPORT WIDTH IS TOO NARROW FOR A SIDEBAR
return (
<Container>
    <Form.Label>Current Category</Form.Label>
    <FormGroup>
        <Form.Control as="select" size="lg" onChange={onChange}>
            {categories.map(category=>{
                return <option key={category.id} value={category.id}>{category.id}. {category.text}</option>
            })}
        </Form.Control>
    </FormGroup>
</Container>
);
}
export default PREF_DefinitionHeader;
