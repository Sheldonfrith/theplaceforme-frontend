import React, { useState, useCallback, useEffect, useContext } from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import WelcomePage from "./Page-Welcome";
import QuestionairePage from "./Page-Questionaire/"; 
import ResultsPage from "./Page-Results";
import AccountPopup from "./Popup-Account";
import LoginPopup from "./Popup-Login";
import styled from 'styled-components';
import Popups from "./Popups";
import { GlobalContext } from "./containers/GlobalProvider";

const firebaseConfig = {
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

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  width: 80%;
`;

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const gc = useContext(GlobalContext);

  //App is primarily a container, handles simple global things like
  //what view should be displaying
  return (
    <AppContainer>
      <Popups/>
      {gc.currentPage==='welcome'?<WelcomePage/>:<></>}
      {gc.currentPage==='questionaire'?<QuestionairePage />:<></>}
      {gc.currentPage==='results'?<ResultsPage />:<></>}
    </AppContainer>
  );
}

export default App;
