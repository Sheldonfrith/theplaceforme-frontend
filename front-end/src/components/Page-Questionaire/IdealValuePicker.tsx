import React from 'react';
import {Dataset}from '../containers/GlobalProvider';
import DataInputContainer from './DataInputContainer';

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
        Move the slider or input a value directly. Countries that are closer to the value you choose here
        will get higher scores and be ranked higher in the final results. 
        The graph above the slider show the distribution of countries within the dataset.
        The number at the top right shows the percentage of countries that are missing data for this dataset.
    </div>
    </DataInputContainer>
    </>
);
}
export default IdealValuePicker;
