import React, { useContext, useState } from 'react';
import { useConditionalEffect } from '../../hooks';
import { AnswersContext, Answers } from '../containers/AnswersProvider';
import DataInputContainer from './DataInputContainer';
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';
import {getInfoDiv} from '../../app-constants';
const infoDiv = getInfoDiv('idealValue');

interface IdealValuePickerProps {
}
const IdealValuePicker: React.FunctionComponent<IdealValuePickerProps> = () => {
    const qc = useContext(QuestionaireLogicContext);
    const disabled = qc.zeroWeight??true;
    const ac = useContext(AnswersContext);
    const currentDataset = qc.currentDataset;
    const getIdealValueFromContext = (): number => {
        const a: Answers = ac.currentAnswers!;
        const thisQuestionInput = a[qc.getAnswersIndexFromID!(qc.currentDataset!.id, a)];
        return thisQuestionInput.idealValue;
    }
    const [idealValue, setIdealValue] = useState<number | null>(getIdealValueFromContext);
    const [currentDatasetID, setCurrentDatasetID] = useState<number>(-1);

    //when current question changes send off the ideal value and get the new one
    useConditionalEffect([qc.currentDataset], () => {
        if (!qc.currentDataset) return;
        ac.updateCurrentAnswers!(idealValue ?? 0, currentDatasetID, 'idealValue');
        setCurrentDatasetID(qc.currentDataset.id);
        setIdealValue(getIdealValueFromContext);
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setIdealValue(e.target.valueAsNumber);
    if (currentDataset) {
        return (
            <DataInputContainer
                distributionMap={currentDataset.distribution_map}
                topRightNumber={currentDataset.missing_data_percentage}
                topLeftString={'Ideal Value'}
                min={currentDataset.min_value || 0}
                max={currentDataset.max_value || 0}
                mainText={currentDataset.unit_description}
                sliderValue={idealValue!}
                sliderOnChange={handleChange}
                disabled={disabled}
                sliderValueSet={setIdealValue}
            >
            {infoDiv}
            </DataInputContainer>
        );
    }
    return <></>;
}
export default IdealValuePicker;
