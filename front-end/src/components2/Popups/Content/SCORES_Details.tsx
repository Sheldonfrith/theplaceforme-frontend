import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Button} from 'react-bootstrap';
import { Location_SCORES, ViewObjectProps, AllLocation_SCORES } from '../../../core/HelperTypes';


interface SCORES_DetailsPopupProps{
    buttons: ViewObjectProps[],
    location_SCORES: AllLocation_SCORES,
    getLocationIDsSortedBy(sortType: string): string[],
}
const SCORES_DetailsPopup: React.FunctionComponent<SCORES_DetailsPopupProps> =({
    buttons, location_SCORES, getLocationIDsSortedBy
})=> {
 
return (
<Container>
    location title
    location logo
    location key info
    location map
    location links
    location detailed SCORE
</Container>
);
}
export default SCORES_DetailsPopup;
