import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import DataInputContainer from './DataInputContainer';
import { getInfoDiv } from "../../app-constants";
import { QuestionaireLogicContext } from "./QuestionaireLogicProvider";
import { AnswersContext, Answers } from "../containers/AnswersProvider";
import { useConditionalEffect } from "../../hooks";
const infoDiv = getInfoDiv('normalizationPercentage');

const InfoContainer = styled.div`
    color: ${props => props.theme.black}
`;

interface NormalizationPickerProps {

}
const NormalizationPicker: React.FunctionComponent<NormalizationPickerProps> = () => {
    const qc = useContext(QuestionaireLogicContext);
    const disabled = (qc.zeroWeight===null||qc.zeroWeight ===undefined)?true:qc.zeroWeight;
    const ac = useContext(AnswersContext);
    const currentDataset = qc.currentDataset;
    const getNormalizationPercentageFromContext = (answers: Answers, dataset: any ): number => {
        const thisQuestionInput = answers[qc.getAnswersIndexFromID!(dataset.id, answers)];
        return thisQuestionInput.normalizationPercentage;
    }
    const [normalizationPercentage, setNormalizationPercentage] = useState<number | null>(null);
    const [currentDatasetID, setCurrentDatasetID] = useState<number>(-1);
    //whenever normalization is null get the actual value from context
    useConditionalEffect([normalizationPercentage],()=>{
        if (!ac.currentAnswers || !qc.currentDataset) return;
        if (normalizationPercentage === null || normalizationPercentage === undefined) {
            setNormalizationPercentage(getNormalizationPercentageFromContext(ac.currentAnswers, qc.currentDataset));
        }
    })
    //when current question changes send off the ideal value and get the new one
    useConditionalEffect([qc.currentDataset], () => {
        if (!qc.currentDataset || !ac.currentAnswers) return;
        ac.updateCurrentAnswers!(normalizationPercentage ?? 0, currentDatasetID, 'normalizationPercentage');
        setCurrentDatasetID(qc.currentDataset.id);
        setNormalizationPercentage(getNormalizationPercentageFromContext(ac.currentAnswers, qc.currentDataset));
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setNormalizationPercentage(e.target.valueAsNumber);
    return (
        <>
            <DataInputContainer
                topLeftString={'Normalization'}
                min={0}
                max={100}
                sliderOnChange={handleChange}
                sliderValue={normalizationPercentage ?? 0}
                mainText="% of normalization to apply"
                disabled={disabled}
                sliderValueSet={setNormalizationPercentage}
            >
                <InfoContainer>
                    {infoDiv}
                </InfoContainer>
            </DataInputContainer>
        </>
    );
}
export default NormalizationPicker;
