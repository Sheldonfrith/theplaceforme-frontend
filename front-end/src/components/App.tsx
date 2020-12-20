import React, { useEffect, useState, useContext, Suspense, useCallback } from "react";
import firebase from "firebase";
import WelcomePage from "./Page-Welcome.bootstrap";
import styled from 'styled-components';
import Popups from "./Popups";
import { GlobalContext } from "./containers/GlobalProvider";
import {VerticalFlexBox} from '../reusable-styles';
import LoadingPage from './Page-Loading';
import Container from 'react-bootstrap/Container';
import {getFirebaseConfig} from '../Secrets/FirebaseAuth';
import {useMachine} from '@xstate/react';
import {AppMachine} from '../core/state-machines/App/machine';

const QuestionairePage = React.lazy(()=>import("./Page-Questionaire"));
const ResultsPage = React.lazy(()=>import("./Page-Results"));
 
//FIREBASE AUTH SETUP
export const firebaseConfig = getFirebaseConfig();
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;

function App() {
  const gc = useContext(GlobalContext);
  const fallback = useCallback(()=>{
    return <LoadingPage/>;
  },[]);
  const [returnTest, setReturnTest] = useState<any>(<div>none</div>);

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
