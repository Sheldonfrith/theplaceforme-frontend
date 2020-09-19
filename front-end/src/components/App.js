import React, { useState, useCallback, useEffect, useContext } from "react";
// import "../styles/App.css";
import Header from "./Header";
import Questionaire from './Questionaire';
import Results from './Results';
import GlobalProvider from "./containers/GlobalProvider";
import TestEndpoint from './TestEndpoint';
import DataInput from "./DataInput";
import UserAccountUI from "./UserAccountUI";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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
let prevUser = "";

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDataEntry, setShowDataEntry] = useState(false);

  useEffect(() => {
    //when user changes and isnt null
    if (!user) return;
    if (user === prevUser) return;
    const asyncWrapper = async () => {
      let result = false;
      await user
        .getIdTokenResult()
        .then((idTokenResult) => {
          // Confirm the user is an Admin.
          if (!!idTokenResult.claims.admin) {
            // Show admin UI.
            setIsAdmin(true);
            console.log("this is an admin account");
          } else {
            // Show regular user UI.
            setIsAdmin(false);
            console.log("this is not an admin account");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return result;
    };
    asyncWrapper();
    prevUser = user;
  }, [user, setIsAdmin]);

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return false;
      },
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };
  //logout callback
  const logout = useCallback(() => {
    firebase.auth().signOut();
  }, []);

  //loggedout view
  if (!user || loading || error) {
    return (
      <div className="container bg-light">
        <div className="container bg-light">
          
          <h1>Welcome to The Place For Me</h1>
          <h3>Please log in to continue.</h3>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </div>
    );
  }
  //logged in view
  else {
    //data entry view
    if (showDataEntry){
      return (
      <div className="container-fluid bg-white">
        
          <GlobalProvider>
            <UserAccountUI logout={logout} user={user} isAdmin={isAdmin} />
            <Header setShowDataEntry={setShowDataEntry}/>
            <div className="container bg-light">
              <DataInput />
            </div>

          </GlobalProvider>
      </div>
      );
    } 
    //question/response view
    else {
      return (
      <div className="container-fluid bg-light">
        <GlobalProvider>
          <UserAccountUI logout={logout} user={user} isAdmin={isAdmin} setShowDataEntry={setShowDataEntry} />
          <Header/>
          <Questionaire/>
        </GlobalProvider>
      </div>
      );
    }

  }
}

export default App;
