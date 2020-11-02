import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import DataInputContainer from './DataInputContainer';
import {Dataset}from '../containers/GlobalProvider';


interface WeightPickerProps{
    updateWeight: any,
    weight: number
}
const WeightPicker: React.FunctionComponent<WeightPickerProps> =({updateWeight, weight})=> {

return (
<DataInputContainer
 min={0}
 max={100}
 topLeftString={'Weight'}
 mainText="How important is this to you?"
 sliderValue={weight}
 sliderOnChange={updateWeight}
 disabled={false}
>
<div>
    Use the slider or input a value directly to set the 'weight' that this question will have 
    relative to all other questions.
    If you set the weight value to 0 then this question will not
     be counted in your final results, therefore you cannot pick an 'ideal value' or any 
     advanced options unless you pick an importance above 0. The scores for this question are MULTIPLIED by the 
     weight you give here, so a question with an weight of "50" will influence
     your final results 50 X more than a question with an weight of "1", so use
     this slider carefully!</div>
</DataInputContainer>
);
}
export default WeightPicker;
