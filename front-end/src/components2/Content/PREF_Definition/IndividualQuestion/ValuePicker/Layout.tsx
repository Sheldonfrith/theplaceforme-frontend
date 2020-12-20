import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Container, Button, Collapse } from 'react-bootstrap';
import IdealValuePicker, {IdealValuePickerProps}from './IdealValuePicker';
import NormalizationPicker, {NormalizationPickerProps} from './NormalizationPicker';
import MissingDataHandlerPicker, {MissingDataHandlerPickerProps} from './MissingDataHandlerPicker';

export interface ValuePickerLayoutContentProps {
    IdealValuePickerProps: IdealValuePickerProps,
    NormalizationPickerProps: NormalizationPickerProps,
    MissingDataHandlerPickerProps: MissingDataHandlerPickerProps,
    getShowAdvanced(): boolean,
    setShowAdvanced(val: boolean): void,
}
const ValuePickerLayoutContent: React.FunctionComponent<ValuePickerLayoutContentProps> = ({
    getShowAdvanced, setShowAdvanced, IdealValuePickerProps, NormalizationPickerProps, MissingDataHandlerPickerProps

}) => {
    return (
        <Container>
            <IdealValuePicker {...IdealValuePickerProps}/>
            <Button
                onClick={() => setShowAdvanced(!getShowAdvanced())}
                aria-controls="advanced options"
                aria-expanded={getShowAdvanced()}
            >Show Advanced Options?</Button>
            <Collapse in={getShowAdvanced()}>
                <NormalizationPicker {...NormalizationPickerProps}/>
                <MissingDataHandlerPicker {...MissingDataHandlerPickerProps}/>
            </Collapse>
        </Container>
    );
}
export default ValuePickerLayoutContent;
