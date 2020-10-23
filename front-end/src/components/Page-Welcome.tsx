import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from 'styled-components';
import { GlobalContext } from "./containers/GlobalProvider";
//this won't do too much
//primary purpose is to prevent the API from being querried on every single page load
//allows for oauth login, or not
//brief description of the app and sales pitch, why its awesome
//large obvious button that leads to the questionaire page

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const WelcomeTitle = styled.h1`
  font-size: 5rem;
`;
const WelcomeBlurb = styled.p`

`;
const PrimaryActionButton = styled.button`

`;
const LoginButton = styled.button`

`;
const SecondaryButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SecondaryButton = styled.button`

`;

interface WelcomePageProps{
}

const WelcomePage : React.FunctionComponent<WelcomePageProps>=({}) =>{
  const gc = useContext(GlobalContext);

  return (
    <WelcomeContainer>
      <WelcomeTitle>The Place For Me</WelcomeTitle>
        <WelcomeBlurb>
          There’s a place for everyone! Find the best country in the world for
          YOU using real data. The best tool available to help you decide where
          to move to, or at least where to dream of moving to ;).
        </WelcomeBlurb>
        <PrimaryActionButton onClick={(e)=>gc.setCurrentPage('questionaire')}>Start Questionaire</PrimaryActionButton>
        <LoginButton onClick={(e)=>gc.setCurrentPopup('login')}>Login</LoginButton>
        <SecondaryButtonArea>
            <SecondaryButton>Donate</SecondaryButton>
            <SecondaryButton onClick={()=>window.open('https://github.com/Sheldonfrith/theplaceforme-frontend')}>Github</SecondaryButton>
        </SecondaryButtonArea>
    </WelcomeContainer>
  );
}

export default WelcomePage;