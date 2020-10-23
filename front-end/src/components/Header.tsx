import React, {useState, FunctionComponent, useContext} from 'react';
import { getRequest } from '../lib/HTTP'; 
import styled from 'styled-components';
import CollapsibleNav from './reusable/CollapsibleNav';
import { GlobalContext } from './containers/GlobalProvider';

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
`;


interface HeaderProps {
}

const Header : FunctionComponent<HeaderProps> =({}) =>{
    const gc = useContext(GlobalContext);

    return (
       <HeaderContainer>
           <div>logo</div>
           <h1>The Place For Me</h1>
            <CollapsibleNav 
            menuItems={[
                {text:'account',
                onClick:()=>gc.setCurrentPopup('account')},
                {text:'login',
                onClick:()=>gc.setCurrentPopup('login')}
            ]}/>
       </HeaderContainer>
    );
}
export default Header;