import React, {useState,useRef} from 'react';
import styled from 'styled-components';
import useOnClickOutside from '../../lib/Hooks/useOnClickOutside';
import {Info} from '@material-ui/icons';

const Container = styled.div`
    position:relative;
`;

const InfoContainer = styled.div<{display:string}>`
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    display: ${props => props.display};
    right: 0;
    position: absolute;
    top: 0;
    right: 0;
    width: 20rem;
    background-color: ${props=>props.theme.white};
    color: ${props=>props.theme.black};
    padding: 1rem;
    z-index: 12;
    font-size: 1.2rem;
    box-shadow: 2px 7px 19px 1px ${props=>props.theme.black};
`;
const IconContainer= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    margin-right: 1rem;
    margin: 1rem 0;
    cursor: pointer;
    color: ${props=>props.theme.primaryAccent};
    :hover{
        color: ${props=>props.theme.black};
    }
`;
interface InfoPopupProps{

}
const InfoPopup: React.FunctionComponent<InfoPopupProps> =({children})=> {
    const ref = useRef(null);
    const [infoDisplay, setInfoDisplay] = useState('none');
    useOnClickOutside(ref,()=>setInfoDisplay('none'));
return (
    <Container>
<IconContainer>

<Info fontSize={'inherit'} onClick={()=>setInfoDisplay('flex')}/>

</IconContainer>
<InfoContainer ref={ref} display={infoDisplay} >{children}</InfoContainer>
</Container>
);
}
export default InfoPopup;
