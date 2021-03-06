
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import InfoPopup from './InfoPopup';
import { Container, MainTextArea, DisabledOverlay, BlurContainer } from './DataInputContainer';
import { getInfoDiv } from "../../app-constants";
import { MissingDataHandlerMethodsContext } from "../containers/MissingDataHandlerMethodsProvider";
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';
import { useConditionalEffect } from "../../hooks";

const infoDiv = getInfoDiv('missingDataHandlerMethod');
const ThisContainer = styled(Container)`
    justify-content: space-between;
`;
const Select = styled.select`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25);

`;
const ThisMainTextArea = styled(MainTextArea)`
    text-align: center;
    max-width: 100%;
`;
const Input = styled.input`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    width: 4rem;
    height: 1.9rem;
    box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25);
    border: none;
`;
interface MissingDataHandlerPickerProps {
}
const MissingDataHandlerPicker: React.FunctionComponent<MissingDataHandlerPickerProps> = () => {
    const mc = useContext(MissingDataHandlerMethodsContext);
    const methods = mc.missingDataHandlerMethods;
    const qc = useContext(QuestionaireLogicContext);
    const disabled = (qc.zeroWeight===null||qc.zeroWeight===undefined)?false:qc.zeroWeight;
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [currentInput, setCurrentInput] = useState<string | null>(null);
    const [selectOptionsJSX, setSelectOptionsJSX] = useState<JSX.Element[] | null>(null);

    //when methods change, update the select options
    useConditionalEffect([methods], () => {
        if (!methods) return;
        setSelectOptionsJSX(Object.keys(methods).map((method: string) => {
            return <option key={method} value={method}>{methods[method].formattedName}</option>;
        }));
    })

    return (
        <>
            <ThisContainer>
                <DisabledOverlay display={disabled ? 'flex' : 'none'}>Select an 'importance' above 0 to change this value.</DisabledOverlay>
                <BlurContainer blur={disabled}>
                    <ThisMainTextArea>What method should we use to handle countries with <b>missing data</b> for this question?</ThisMainTextArea>
                    {(methods) ?
                        <Select onChange={(e) => setSelectedMethod(e.target.value)}>
                            {selectOptionsJSX}
                        </Select>
                        : <></>
                    }
                    {
                        (methods && selectedMethod && methods[selectedMethod].requiresInput) ?
                            <Input type="text" placeholder="Input here for this method..." onChange={(e) => setCurrentInput(e.target.value)}></Input>
                            : <></>
                    }
                    <InfoPopup>
                        {infoDiv}
                    </InfoPopup>
                </BlurContainer>
            </ThisContainer>
        </>
    );
}
export default MissingDataHandlerPicker;
