import React, { useState, useCallback, useEffect, useContext } from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import WelcomePage from "./Page-Welcome";
import QuestionairePage from "./Page-Questionaire/"; 
import ResultsPage from "./Page-Results";
import styled from 'styled-components';
import Popups from "./Popups";
import { GlobalContext } from "./containers/GlobalProvider";


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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  width: 80%;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(to right,${props=>props.bgleft},${props=>props.bgmid},${props=>props.bgright});
  transition: background-image 1s ease 0s;
  background-blend-mode: overlay;
  background-color: rgb(0,0,0,0.5);
  position:relative;
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
