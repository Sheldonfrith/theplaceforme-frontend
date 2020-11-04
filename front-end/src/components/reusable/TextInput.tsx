import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import {HorizontalFlexBox, SubheadingText} from '../ReusableStyles';
const Container = styled.div`
    ${HorizontalFlexBox};
`;

const Label = styled.div`
    ${SubheadingText};
`;

const Input = styled.input`
    background: white;
    font-size: ${props=>props.theme.font5};
    color: ${props=>props.theme.black};
    border-radius: 0.5rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-style: none;
    padding:0.5rem 1rem;
    margin: 0;
    width:100%;
    :hover{
        color: ${props=>props.theme.red};
    }
`;

interface TextInputProps{
    placeholder?: string,
    onChange: any,
    label?: string,
    value: any,
}

const TextInput: React.FunctionComponent<TextInputProps> = ({placeholder, onChange, label, value}) =>{

return (
<Container>
    {label?
    <Label>{label}</Label>
    :<></>}
    <Input
    type="text"
    placeholder={placeholder?placeholder:''}
    onChange={onChange}
    value={value}
    />
</Container>
);
}

export default TextInput;