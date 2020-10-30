import React, {useState, FunctionComponent, useContext, useCallback} from 'react';
import { getRequest } from '../lib/HTTP'; 
import styled from 'styled-components';
import CollapsibleNav from './reusable/CollapsibleNav';
import { GlobalContext } from './containers/GlobalProvider';
import {auth} from './App';
import { useAuthState } from "react-firebase-hooks/auth";
// import {StyledContext}from'./containers/StyledProvider';
import { ThemeContext } from 'styled-components';


const HeaderContainer = styled.div<{textColor:string}>`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-evenly;
width: 100%;
color: ${props=>props.textColor};
`;

const Title = styled.h1`
cursor: pointer;
`;

const Logo = styled.div`
    cursor: pointer;
`;

interface HeaderProps {
    resetHandler? : any,
    textColor?: string,
}

const Header : FunctionComponent<HeaderProps> =({resetHandler, textColor}) =>{
    const gc = useContext(GlobalContext);
    const theme = useContext(ThemeContext);

    textColor = textColor || theme.white;

    const [user, loading, error] = useAuthState(auth());
    const getMenuItems = useCallback(()=>{
        let menuItems = [
            {text: 'View on GitHub', onClick:()=>window.open('https://github.com/Sheldonfrith/theplaceforme-frontend')},
            {text: 'Donate', onClick:()=>null},
        ]; // regardless of user logged in status, or the current page, always have these options in the menu
        
        //if the page is the Questionaire page...
        const questionDefaults = {text: 'Change Question Defaults', onClick:()=>gc.setCurrentPopup('changeDefaults')};
        if (resetHandler && gc.currentPage==='questionaire'){
            const resetForm = {text: 'Reset Questionaire', onClick:()=>resetHandler()};
            menuItems.splice(1,0,resetForm);
        }
        if (gc.currentPage==='questionaire' ){
            menuItems.splice(1,0,questionDefaults);
        }
        

        //if the user is logged in or not logged in...
        const loginItem = {text: 'Login', onClick:()=>gc.setCurrentPopup('login')};
        const accountItem = {text: 'Account', onClick:()=>gc.setCurrentPopup('account')};
        if (user && !error && !loading){
            //user logged in
            menuItems.splice(0,0,accountItem);
        } else if (!user && !error && loading){
            //user loading
           //keep default menu items
        } else if (!user && !loading && error){
            //user error
            alert('error with the authentication: '+error);
            //add login item just in case
            menuItems.splice(0,0,loginItem);
        } else {
            //no user
            menuItems.splice(0,0,loginItem);
        }
        return menuItems;
    },[user,error,loading, gc, resetHandler, gc.setCurrentPopup]);
    

    return (
       <HeaderContainer textColor={textColor!}>
           <Logo onClick={()=>gc.setCurrentPage('welcome')}>logo</Logo>
           <Title onClick={()=>gc.setCurrentPage('welcome')}>The Place For Me</Title>
           {getMenuItems()?
            <CollapsibleNav 
            menuItems={getMenuItems()}/>
           :<></>}
       </HeaderContainer>
    );
}
export default Header;