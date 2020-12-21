import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container} from 'react-bootstrap';
import {auth} from '../../Layout';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";



interface LoginPopupProps{
    successCallback (newUser: any):void,
    failureCallback ():void,
}
const LoginPopup: React.FunctionComponent<LoginPopupProps> =({successCallback,failureCallback})=> {


// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    callbacks: {
      signInSuccessWithAuthResult: (authResult:any) => {
          successCallback(authResult);
        return false;
      },
      signInFailure: async ()=>{
          failureCallback();
      }
    },
    signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
      auth.FacebookAuthProvider.PROVIDER_ID,
      auth.GithubAuthProvider.PROVIDER_ID,
      auth.TwitterAuthProvider.PROVIDER_ID,
      auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };


return (
<Container>
    <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={auth()}
        />
</Container>
);
}
export default LoginPopup;
