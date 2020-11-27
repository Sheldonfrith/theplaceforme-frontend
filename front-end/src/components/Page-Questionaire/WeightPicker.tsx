import React, {useContext, useEffect, useState} from 'react';
import { useConditionalEffect } from "../../hooks";
import DataInputContainer from './DataInputContainer';
import { getInfoDiv } from "../../app-constants";
import { QuestionaireLogicContext } from "./QuestionaireLogicProvider";
import { AnswersContext, Answers } from "../containers/AnswersProvider";
const infoDiv = getInfoDiv('weight');

interface WeightPickerProps{
}
const WeightPicker: React.FunctionComponent<WeightPickerProps> =()=> {

    const qc = useContext(QuestionaireLogicContext);
    const ac = useContext(AnswersContext);
    const getWeightFromContext = (answers: Answers, dataset: any ): number => {
        const thisQuestionInput = answers[qc.getAnswersIndexFromID!(dataset.id, answers)];
        return thisQuestionInput.weight;
    }
    const [weight, setWeight] = useState<number|null>(null);
    //whenever weight is null or undefined set it based on the context
    useConditionalEffect([weight],()=>{
        if (!ac.currentAnswers || !qc.currentDataset) return;
        if (weight === null || weight === undefined){
            setWeight(getWeightFromContext(ac.currentAnswers, qc.currentDataset));
        }
    });
    
    //BECAUSE WEIGHT CHANGES HAVE IMMEDIATE SIDE EFFECTS, MUST CONSTANTLY PUSH CHANGES TO ANSWERS CONTEXT
    useConditionalEffect([weight], ()=>{
        if (!qc.currentDataset || weight===null || weight ===undefined) return;
        ac.updateCurrentAnswers!(weight, qc.currentDataset!.id, 'weight');
    })
    //whenever current current dataset changes reset the weight
    useConditionalEffect([qc.currentDataset],()=>{
        if (!qc.currentDataset || !ac.currentAnswers)return;
        setWeight(getWeightFromContext(ac.currentAnswers, qc.currentDataset));
    })
    //whenever weight is zero send the setIsZero to the context, and vice versa with it not being zero
    useConditionalEffect([weight], ()=>{
        if (!weight) {
            qc.setZeroWeight!(true);
        } else {qc.setZeroWeight!(false)}
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.valueAsNumber);

return (
<DataInputContainer
 min={0}
 max={100}
 topLeftString={'Weight'}
 mainText="How important is this to you?"
 sliderValue={weight??0}
 sliderOnChange={handleChange}
 sliderValueSet={setWeight}
 disabled={false}
>
{infoDiv}
</DataInputContainer>
);
}
export default WeightPicker;
