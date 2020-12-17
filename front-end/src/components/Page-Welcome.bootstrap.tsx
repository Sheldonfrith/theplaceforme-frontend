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
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {useMachine} from '@xstate/react';
import {appMachine} from '../core/state-machines/App/machine';

const welcomeBlurb = getWelcomeBlurb();

// const WelcomeContainer = styled.div`
//   ${PageContainer};
//   height: 100%;
//   padding: 0 3rem;
// `;
// const WelcomeTitle = styled.h1`
//   font-size: ${(props) => props.theme.font7};
//   font-family: ${(props) => props.theme.fontFamHeader};
// `;
// const WelcomeBlurb = styled.p`
//   ${ParagraphText};
//   font-size: ${(props) => props.theme.font7};
//   width: 90%;
//   @media (max-width: ${props => props.theme.primaryBreakpoint}px){
//     font-size: ${props => props.theme.font5};
//   }
// `;
// const PrimaryActionButton = styled.button`
//   ${FilledButton};
// `;
// const LoginButton = styled.button`
//   ${TransparentButton};
//   margin: 1rem;
//   /* width: 80%; */
// `;
// const SecondaryButtonArea = styled.div`
//   ${HorizontalFlexBox};
//   width: 85%;
//   @media (max-width: ${props => props.theme.primaryBreakpoint}px){
//         flex-direction: column;
//     }
// `;
// const SecondaryButton = styled.button`
//   ${TransparentButton};
//   margin: 1rem;
// `;
// const WelcomeGreeting = styled.div`
//   ${SubheadingText};
// `;

interface WelcomePageProps { }

const WelcomePage: React.FunctionComponent<WelcomePageProps> = ({ }) => {
  const gc = useContext(GlobalContext);
  const [user, loading, error] = useAuthState(auth());
  const [state, send] = useMachine(appMachine);

  return (
    <Container className="container-fluid">
      <Jumbotron>
        <h1 className="h1">ThePlaceFor.Me</h1>
      <p className="lead">
        {welcomeBlurb}
      </p>
      <Button className="btn btn-default" onClick={(e) => gc.setCurrentPage("questionaire")}>
        Start Questionaire
      </Button>
      </Jumbotron>
      
      {user ?
        <p>
          Welcome {user.displayName?.toUpperCase()}!
          </p>
        : <></>}
      <Container>
        <Button className="btn btn-primary" onClick={() => user ? logout() : gc.setCurrentPopup('login')}>{user ? 'Logout' : 'Login'}</Button>
        <Button className="btn btn-secondary"
          onClick={() => {
            window.open('https://www.patreon.com/sheldonfrith_web');
          }}
        >Donate</Button>
        <Button className="btn btn-secondary"
          onClick={() =>
            window.open(
              "https://github.com/Sheldonfrith/theplaceforme-frontend"
            )
          }
        >
          Github
            </Button>
      </Container>
    </Container>
  );
};

export default WelcomePage;
