import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Collapse, Container, Button, ButtonGroup} from 'react-bootstrap';
import WeightSimpleSelect, {WeightSimpleSelectProps} from './SimpleSelect';

export interface WeightPickerLayoutContentProps{
    Explanation: JSX.Element
    getShowAdvanced ():boolean,
    setShowAdvanced (val: boolean):void,
    AdvancedContent: JSX.Element,
    WeightSimpleSelectProps: WeightPickerLayoutContentProps,
}
const WeightPickerLayoutContent: React.FunctionComponent<WeightPickerLayoutContentProps> =({
    Explanation, getShowAdvanced, setShowAdvanced, WeightSimpleSelectProps, AdvancedContent
})=> {
return (
<Container>
    {Explanation}
    {/* <WeightSimpleSelect {...WeightSimpleSelectProps}/> */}
    <Button
        onClick={()=>setShowAdvanced(!getShowAdvanced())}
        aria-controls="advanced options"
        aria-expanded={getShowAdvanced()}
    >Show Advanced Options?</Button>
    <Collapse in={getShowAdvanced()}>
        {AdvancedContent}
    </Collapse>
</Container>
);
}
export default WeightPickerLayoutContent;
