import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from 'styled-components';
import { GlobalContext } from "./containers/GlobalProvider";
import getThemeColors from '../lib/UI-Constants/themeColors';
import {FilledButton, HorizontalFlexBox, VerticalFlexBox, PageContainer, TransparentButton} from './ReusableStyles'
import { logout, auth} from './App';
import { useAuthState } from "react-firebase-hooks/auth";
//this won't do too much
//primary purpose is to prevent the API from being querried on every single page load
//allows for oauth login, or not
//brief description of the app and sales pitch, why its awesome
//large obvious button that leads to the questionaire page

const WelcomeContainer = styled.div`
  ${PageContainer};
  color: ${props => props.theme.white};
  height: 100%;
  padding: 0 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 4rem;
`;
const WelcomeBlurb = styled.p`
  font-size: 200%;
`;
const PrimaryActionButton = styled.button`
  ${FilledButton};
  font-size: 300%;
  padding: 1rem 2rem;
  margin: 2rem;
  background-color: ${props=>props.theme.red};
`;
const LoginButton = styled.button`
  ${TransparentButton};
  margin:1rem;
  width: 80%;
`;
const SecondaryButtonArea = styled.div`
  ${HorizontalFlexBox};
  width: 85%
`;
const SecondaryButton = styled.button`
  ${TransparentButton};
  margin: 1rem;
`;

interface WelcomePageProps{
}

const WelcomePage : React.FunctionComponent<WelcomePageProps>=({}) =>{
  const gc = useContext(GlobalContext);
  const [user, loading, error] = useAuthState(auth());
  
  

  return (
    <WelcomeContainer>
      <WelcomeTitle>The Place For Me</WelcomeTitle>
        <WelcomeBlurb>
          There’s a place for everyone! Find the best country in the world for <i>YOU</i> using real data. This is the best tool available to help you decide where to move to.
        </WelcomeBlurb>
        <PrimaryActionButton onClick={(e)=>gc.setCurrentPage('questionaire')}>Start Questionaire</PrimaryActionButton>
        {user?
        <>
          <div>Welcome {user.displayName}!</div>
          <button onClick={()=>logout()}>Logout</button>
          </>
        :<LoginButton onClick={(e)=>gc.setCurrentPopup('login')}>Login</LoginButton>}
        <SecondaryButtonArea>
            <SecondaryButton>Donate</SecondaryButton>
            <SecondaryButton onClick={()=>window.open('https://github.com/Sheldonfrith/theplaceforme-frontend')}>Github</SecondaryButton>
        </SecondaryButtonArea>
    </WelcomeContainer>
  );
}

export default WelcomePage;