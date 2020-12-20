import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Spinner}from 'react-bootstrap';

export interface Loading_PREF_DefinitionProps{

}
const Loading_PREF_Definition: React.FunctionComponent<Loading_PREF_DefinitionProps> =({})=> {

return (
<Container>
    <Spinner animation="border" role="status"></Spinner>
</Container>
);
}
export default Loading_PREF_Definition;
