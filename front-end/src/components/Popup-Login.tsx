import React from 'react';
import styled from 'styled-components';
import {auth} from './App';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
// import {StyledContext}from './containers/StyledProvider';
import {PopupInner} from './ReusableStyles';

const PopupInnerContainer = styled.div`${PopupInner}`;

interface LoginPopupProps {
    closePopup: any;
}

const LoginPopup: React.FunctionComponent<LoginPopupProps>=({closePopup}) =>{

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    callbacks: {
      signInSuccessWithAuthResult: () => {
        //close the login popup
        closePopup();
        return false;
      },
    },
    signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
      auth.FacebookAuthProvider.PROVIDER_ID,
      auth.GithubAuthProvider.PROVIDER_ID,
      auth.TwitterAuthProvider.PROVIDER_ID,
      auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };



// const sc = useContext(StyledContext);
// const PopupInner = sc.PopupInner;
return (
<PopupInnerContainer>
<StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={auth()}
          />
</PopupInnerContainer>
);
}
export default LoginPopup;