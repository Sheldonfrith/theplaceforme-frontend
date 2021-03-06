import React, { useContext } from "react";
import styled from "styled-components";
import { GlobalContext } from "./containers/GlobalProvider";
import {
  FilledButton,
  HorizontalFlexBox,
  ParagraphText,
  PageContainer,
  TransparentButton,
  SubheadingText,
} from "../reusable-styles";
import { logout, auth } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
import { getWelcomeBlurb } from '../app-constants';

const welcomeBlurb = getWelcomeBlurb();

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
  @media (max-width: ${props => props.theme.primaryBreakpoint}px){
    font-size: ${props => props.theme.font5};
  }
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
  @media (max-width: ${props => props.theme.primaryBreakpoint}px){
        flex-direction: column;
    }
`;
const SecondaryButton = styled.button`
  ${TransparentButton};
  margin: 1rem;
`;
const WelcomeGreeting = styled.div`
  ${SubheadingText};
`;

interface WelcomePageProps { }

const WelcomePage: React.FunctionComponent<WelcomePageProps> = ({ }) => {
  const gc = useContext(GlobalContext);
  const [user, loading, error] = useAuthState(auth());

  return (
    <WelcomeContainer>
      <WelcomeTitle>ThePlaceFor.Me</WelcomeTitle>
      <WelcomeBlurb>
        {welcomeBlurb}
      </WelcomeBlurb>
      <PrimaryActionButton onClick={(e) => gc.setCurrentPage("questionaire")}>
        Start Questionaire
      </PrimaryActionButton>
      {user ?
        <WelcomeGreeting>
          Welcome {user.displayName?.toUpperCase()}!
          </WelcomeGreeting>
        : <></>}
      <SecondaryButtonArea>
        <LoginButton onClick={() => user ? logout() : gc.setCurrentPopup('login')}>{user ? 'Logout' : 'Login'}</LoginButton>
        <SecondaryButton
          onClick={() => {
            window.open('https://www.patreon.com/sheldonfrith_web');
          }}
        >Donate</SecondaryButton>
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
    </WelcomeContainer>
  );
};

export default WelcomePage;
