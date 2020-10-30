import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import styled from 'styled-components';
import {MoreHoriz} from '@material-ui/icons';
import useOnClickOutside from '../../lib/Hooks/useOnClickOutside';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


const Icon =styled.div`
    cursor: pointer;
`;

const Container = styled.div`
    position: relative;
`;

const DropdownContainer =  styled.div<{display:string}>`
    display: ${props => props.display};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.theme.black};
    color: ${props => props.theme.white};
    font-size: 3rem;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 12;
    padding: 1rem;
    border-radius: 1rem 0 1rem 1rem;
    border: ${props=> props.theme.black};
`;
const DropdownItem = styled.div`
    text-align: center;
    border: lightgrey solid;
    border-width: 0.2rem;
    border-radius: 0.5rem;
    width: 15rem;
    padding: 1rem 2rem;
    /* background-image: radial-gradient(white,white, transparent); */
    margin: 0.4rem 0;
    cursor: pointer;
`;

interface menuItem {
    text: string,
    onClick?: (...args: any)=>any,
}
type menuItems = Array<menuItem>;
interface CollapsibleNavProps {
    menuItems: menuItems
}

const CollapsibleNav: React.FunctionComponent<CollapsibleNavProps>= ({menuItems})=> {
    const ref = useRef(null);
    useOnClickOutside(ref,()=>setIsOpen(false));
const [isOpen, setIsOpen] = useState<boolean>(false);

// return (
// <Container>
//     <Icon onClick={():void=>{
//         console.log('menu clicked', isOpen);
//         setIsOpen((prev:boolean):boolean =>!prev);  
//         }}>
//     <MoreHoriz />
//     </Icon>
//     <DropdownContainer 
//     ref={ref}
//     display={isOpen?'flex':'none'}>
//     {menuItems?
//         menuItems.map((item: menuItem,index: number)=><DropdownItem key={'collapsibleNav'+index} onClick={item.onClick}>{item.text.toUpperCase()}</DropdownItem>)
//     :<></>}
//     </DropdownContainer>
// </Container>
// );

return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            Menu
          </Button>
          <Menu 
          {...bindMenu(popupState)}
          PaperProps={{
            style: {
              maxHeight: '80vh',
              width: '19rem',
            },
          }}
          >
              {menuItems?
        menuItems.map((item: menuItem,index: number)=>{
        if (!item || !item.onClick) return <></>;
        return <MenuItem key={'collapsibleNav'+index} onClick={()=>{popupState.close();item.onClick!();}}>{item.text.toUpperCase()}</MenuItem>
        })
    :<></>}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
);
}
export default CollapsibleNav;