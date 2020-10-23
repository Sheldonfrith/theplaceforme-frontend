import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import DataInputContainer from './DataInputContainer';

const InfoContainer = styled.div`
    color: ${props=>props.theme.black}
`;

interface NormalizationPickerProps{

}
const NormalizationPicker: React.FunctionComponent<NormalizationPickerProps> =({})=> {

return (
<DataInputContainer
min={0}
max={100}
mainText="% of normalization to apply"
>
<InfoContainer>
    Normalization spreads out the distribution of countries. It should be used for datasets/questions that are 
    highly 'skewed'. Look at the graph for this question... if all of the countries are concentrated in one or 
    two parts of the graph with almost no countries in other parts of the graph, then you should probably
    apply normalization. I would recommend between 50 and 75% for very uneven country distributions,
    and 0-25% for fairly even distributions. If you understand what normalization does you can choose
    any value even up to 100% (which completely spreads out all countries evenly along the range of scores).
    The more normalization you apply, the more
    that slight differences between countries 
    will matter, and the less large differences will matter.
</InfoContainer>
</DataInputContainer>
);
}
export default NormalizationPicker;
