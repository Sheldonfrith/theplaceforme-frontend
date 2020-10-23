import React, {useState, useEffect, useContext, useCallback,useRef} from 'react';
import styled from 'styled-components';
import useOnClickOutside from '../../lib/Hooks/useOnClickOutside';
import {Info} from '@material-ui/icons';

const Container = styled.div<{display:string}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    display: ${props => props.display};
    right: 0;
`;

interface InfoPopupProps{

}
const InfoPopup: React.FunctionComponent<InfoPopupProps> =({children})=> {
    const ref = useRef(null);
    const [infoDisplay, setInfoDisplay] = useState('none');
    useOnClickOutside(ref,()=>setInfoDisplay('none'));
return (
    <>
<Info onClick={()=>setInfoDisplay('absolute')}/>
<Container ref={ref} display={infoDisplay} >{children}</Container>
</>
);
}
export default InfoPopup;
