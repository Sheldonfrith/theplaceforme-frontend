import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import {MoreHoriz} from '@material-ui/icons';

const Icon =styled.div`
    cursor: pointer;
`;


const DropdownContainer =  styled.div<{display:string}>`
    display: ${props => props.display};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;
const DropdownItem = styled.div`
    padding: 0.2rem;
    text-align: center;
`;

interface menuItem {
    text: string,
    onClick?: (...args: any)=>any,
}
interface menuItems extends Array<menuItem> {
}
interface CollapsibleNavProps {
    menuItems: menuItems
}

const CollapsibleNav: React.FunctionComponent<CollapsibleNavProps>= ({menuItems})=> {

const [isOpen, setIsOpen] = useState<boolean>(false);

return (
<div>
    <Icon onClick={():void=>{
        console.log('menu clicked', isOpen);
        setIsOpen((prev:boolean):boolean =>!prev);  
        }}>
    <MoreHoriz />
    </Icon>
    <DropdownContainer display={isOpen?'flex':'none'}>
    {menuItems?
        menuItems.map((item: menuItem,index: number)=><DropdownItem key={'collapsibleNav'+index} onClick={item.onClick}>{item.text}</DropdownItem>)
    :<></>}
    </DropdownContainer>
</div>
);
}
export default CollapsibleNav;