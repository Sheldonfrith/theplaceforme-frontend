import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import DataInputContainer, {DisabledOverlay} from './DataInputContainer';
import {Dataset, GlobalContext}from '../containers/GlobalProvider';

interface IdealValuePickerProps{
    dataset: Dataset
    updateIdealValue: any,
    idealValue: number,
    disabled: boolean,
}
const IdealValuePicker: React.FunctionComponent<IdealValuePickerProps>= ({dataset, disabled, updateIdealValue, idealValue})=> {

return (
    <>
    <DataInputContainer
        distributionMap={JSON.parse(dataset.distribution_map)}
        topRightNumber={dataset.missing_data_percentage}
        topLeftString={'Ideal Value'}
        min={dataset.min_value||0}
        max={dataset.max_value||0}
        mainText={dataset.unit_description}
        sliderValue={idealValue}
        sliderOnChange={updateIdealValue}
        disabled={disabled}
    >
    <div>
        Information about choosing your ideal value goes here.
        The graph show the distribution of countries within the dataset. etc.
    </div>
    </DataInputContainer>
    </>
);
}
export default IdealValuePicker;
