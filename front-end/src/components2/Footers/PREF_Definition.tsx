import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {ButtonGroup, Button}from 'react-bootstrap';
import {ViewObjectProps}from '../Layout';

export interface PREF_DefinitionFooterProps{
    buttons: ViewObjectProps[]
}
const PREF_DefinitionFooter: React.FunctionComponent<PREF_DefinitionFooterProps> =({buttons})=> {

return (
<ButtonGroup>
    {buttons.map((button: ViewObjectProps)=>{
        return <Button key={button.id} onClick={button.onClick}>{button.text}</Button>;
    })}
</ButtonGroup>
);
}
export default PREF_DefinitionFooter;
