import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import DataInputContainer from './DataInputContainer';
import {Dataset}from '../containers/GlobalProvider';


interface IdealValuePickerProps{
    dataset: Dataset
}
const IdealValuePicker: React.FunctionComponent<IdealValuePickerProps>= ({dataset})=> {

return (
<DataInputContainer
    distributionMap={JSON.parse(dataset.distribution_map)}
    topRightNumber={dataset.missing_data_percentage+'%'}
    min={dataset.min_value}
    max={dataset.max_value}
    mainText={dataset.unit_description}
    
>
<div>
    Information about choosing your ideal value goes here. 
    The graph show the distribution of countries within the dataset. etc.
</div>
</DataInputContainer>
);
}
export default IdealValuePicker;
