
import React, {useContext} from 'react';
import styled from 'styled-components';
import {Container, BlurContainer} from './DataInputContainer';
import {SubheadingText, VerticalFlexBox}from '../../reusable-styles';
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';

const Title = styled.div`
    ${SubheadingText};
`;

const SubContainer = styled.div`
    ${VerticalFlexBox};
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    overflow: hidden;
`;

interface DatasetNotesProps{
}
const DatasetNotes: React.FunctionComponent<DatasetNotesProps> =()=> {
const qc = useContext(QuestionaireLogicContext);
const currentDataset = qc.currentDataset;
if (!currentDataset)    return <></>;
return (
<Container>
    <BlurContainer blur={false}>
        <SubContainer>
            <Title><b>Additional info about the dataset connected with this question:</b></Title>
            <div>
                text={
        'Data Source: '+currentDataset.source_link || 
        'Data Source: '+ currentDataset.source_description || 
        'Notes For This Dataset: '+currentDataset.notes || 
        'Nothing to display.'}
            </div>
        </SubContainer>
    </BlurContainer>
</Container>
);
}
export default DatasetNotes;
