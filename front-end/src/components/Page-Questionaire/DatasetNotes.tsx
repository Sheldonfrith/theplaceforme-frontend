
import React from 'react';
import styled from 'styled-components';
import {Container, BlurContainer} from './DataInputContainer';
import {SubheadingText, VerticalFlexBox}from '../ReusableStyles';

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
    text: string,
}
const DatasetNotes: React.FunctionComponent<DatasetNotesProps> =({text})=> {


return (
<Container>
    <BlurContainer blur={false}>
        <SubContainer>
            <Title><b>Additional info about the dataset connected with this question:</b></Title>
            <div>
            {text}
            </div>
        </SubContainer>
    </BlurContainer>
</Container>
);
}
export default DatasetNotes;
