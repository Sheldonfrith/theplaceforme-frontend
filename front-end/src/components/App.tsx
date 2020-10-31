import React, { useState, useCallback, useEffect, useContext } from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import WelcomePage from "./Page-Welcome";
import QuestionairePage from "./Page-Questionaire/"; 
import ResultsPage from "./Page-Results";
import styled from 'styled-components';
import Popups from "./Popups";
import { GlobalContext } from "./containers/GlobalProvider";
import {VerticalFlexBox} from './ReusableStyles';


export const firebaseConfig = {
  apiKey: "AIzaSyAJ-kNCFTlJZ943avU3KxvI9RXDJJYfUZk",
  authDomain: "theplaceforme-bc9bb.firebaseapp.com",
  databaseURL: "https://theplaceforme-bc9bb.firebaseio.com",
  projectId: "theplaceforme-bc9bb",
  storageBucket: "theplaceforme-bc9bb.appspot.com",
  messagingSenderId: "282721405524",
  appId: "1:282721405524:web:3c593adcc9c5c1f08dfbc1",
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;

//logout callback
export const logout = () => {
  firebase.auth().signOut();
};


const AppContainer = styled.div<{bgleft:string,bgmid:string,bgright:string}>`
  font-family: ${props=>props.theme.fontFamBody};
  font-size: ${props=>props.theme.font2};
  ${VerticalFlexBox}
  margin: auto;
  width: 80%;
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
  const [user, loading, error] = useAuthState(firebase.auth());
  const gc = useContext(GlobalContext);
  const [bgTrio, setbgTrio] = useState<Array<string>>(['white','white','white']);

  //App is primarily a container, handles simple global things like
  //what view should be displaying
  return (
    <AppContainer
    bgleft={bgTrio[0]}
    bgmid={bgTrio[1]}
    bgright={bgTrio[2]}
    >
      <Popups/>
      {gc.currentPage==='welcome'?<WelcomePage/>:<></>}
      {gc.currentPage==='questionaire'?<QuestionairePage setbgTrio={setbgTrio} />:<></>}
      {gc.currentPage==='results'?<ResultsPage />:<></>}
    </AppContainer>
  );
}

export default App;
