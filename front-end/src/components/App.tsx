import React, { useState, useContext, Suspense, useCallback } from "react";
import firebase from "firebase";
import WelcomePage from "./Page-Welcome.bootstrap";
import styled from 'styled-components';
import Popups from "./Popups";
import { GlobalContext } from "./containers/GlobalProvider";
import {VerticalFlexBox} from '../reusable-styles';
import LoadingPage from './Page-Loading';
import Container from 'react-bootstrap/Container';
import {getFirebaseConfig} from '../Secrets/FirebaseAuth';
const QuestionairePage = React.lazy(()=>import("./Page-Questionaire"));
const ResultsPage = React.lazy(()=>import("./Page-Results"));

//FIREBASE AUTH SETUP
export const firebaseConfig = getFirebaseConfig();
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;


const AppContainer = styled.div`
  font-family: ${props=>props.theme.fontFamBody};
  font-size: ${props=>props.theme.font2};
  ${VerticalFlexBox}
  margin: auto;
  width: 66%;
  box-shadow: 3px 3px 12px 3px black;
  height: 100vh;
  overflow: hidden;
  background-image: ${props =>props.theme.primaryLightBackground};
  color: ${props=>props.theme.black};
  position:relative;
  @media (max-width: ${props=>props.theme.largerBreakpoint}px){
    width: 100%;
  }
`;

function App() {
  const gc = useContext(GlobalContext);
  const fallback = useCallback(()=>{
    return <LoadingPage/>;
  },[]);
  return (
    <Container className="container">
      <Popups/>
          {gc.currentPage==='welcome'?<WelcomePage/>:<></>}
          {gc.currentPage==='questionaire'?<Suspense fallback={fallback()}><QuestionairePage/></Suspense>:<></>}
          {gc.currentPage==='results'?<Suspense fallback={fallback()}><ResultsPage /></Suspense>:<></>}
    </Container>
  );
}

export default App;
