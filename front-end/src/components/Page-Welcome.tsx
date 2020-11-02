import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import { GlobalContext } from "./containers/GlobalProvider";
import getThemeColors from "../lib/UI-Constants/themeColors";
import {
  FilledButton,
  HorizontalFlexBox,
  VerticalFlexBox,
  ParagraphText,
  PageContainer,
  TransparentButton,
  SubheadingText,
} from "./ReusableStyles";
import { logout, auth } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
//this won't do too much
//primary purpose is to prevent the API from being querried on every single page load
//allows for oauth login, or not
//brief description of the app and sales pitch, why its awesome
//large obvious button that leads to the questionaire page

const WelcomeContainer = styled.div`
  ${PageContainer};
  height: 100%;
  padding: 0 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: ${(props) => props.theme.font7};
  font-family: ${(props) => props.theme.fontFamHeader};
`;
const WelcomeBlurb = styled.p`
  ${ParagraphText};
  font-size: ${(props) => props.theme.font7};
  width: 90%;
`;
const PrimaryActionButton = styled.button`
  ${FilledButton};
`;
const LoginButton = styled.button`
  ${TransparentButton};
  margin: 1rem;
  /* width: 80%; */
`;
const SecondaryButtonArea = styled.div`
  ${HorizontalFlexBox};
  width: 85%;
`;
const SecondaryButton = styled.button`
  ${TransparentButton};
  margin: 1rem;
`;
const WelcomeGreeting = styled.div`
  ${SubheadingText};
`;

interface WelcomePageProps {}

const WelcomePage: React.FunctionComponent<WelcomePageProps> = ({}) => {
  const gc = useContext(GlobalContext);
  const [user, loading, error] = useAuthState(auth());

  return (
    <WelcomeContainer>
      <WelcomeTitle>ThePlaceFor.Me</WelcomeTitle>
      <WelcomeBlurb>
        There’s a place for everyone! Find the best country in the world for{" "}
        <i>YOU</i> using real data. This is the best tool available to help you
        decide where to move to.
      </WelcomeBlurb>
      <PrimaryActionButton onClick={(e) => gc.setCurrentPage("questionaire")}>
        Start Questionaire
      </PrimaryActionButton>
      {user ? (
        <>
          <WelcomeGreeting>
            Welcome {user.displayName?.toUpperCase()}!
          </WelcomeGreeting>
          <SecondaryButtonArea>
            <LoginButton onClick={() => logout()}>Logout</LoginButton>
            <SecondaryButton>Donate</SecondaryButton>
            <SecondaryButton
              onClick={() =>
                window.open(
                  "https://github.com/Sheldonfrith/theplaceforme-frontend"
                )
              }
            >
              Github
            </SecondaryButton>
          </SecondaryButtonArea>
        </>
      ) : (
        <>
          <SecondaryButtonArea>
            <LoginButton onClick={(e) => gc.setCurrentPopup("login")}>
              Login
            </LoginButton>
            <SecondaryButton>Donate</SecondaryButton>
            <SecondaryButton
              onClick={() =>
                window.open(
                  "https://github.com/Sheldonfrith/theplaceforme-frontend"
                )
              }
            >
              Github
            </SecondaryButton>
          </SecondaryButtonArea>
        </>
      )}
    </WelcomeContainer>
  );
};

export default WelcomePage;
