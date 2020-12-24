import React, { useEffect, useState, useContext, Suspense, useCallback } from "react";
import firebase from "firebase";
import Container from 'react-bootstrap/Container';
import {getFirebaseConfig} from '../Secrets/FirebaseAuth';
import {useMachine} from '@xstate/react';
import {LayoutMachine} from '../core/state-machines/Layout/machine';
import {AppMachine}from '../core/state-machines/App/machine';
import { Machine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";
// import * as c from './index';
// import IndividualQuestionSpecificHeader from "./Headers/IndividualQuestion";
// import DefaultHeader from "./Headers/Default";
// import {ObservableState}from '../core/Controller/ViewUpdater';

// const observableState = new ObservableState();//TODO needs to be passed to the controller as well

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});
// Edit your service(s) here
export const service = interpret(AppMachine, { devTools: true }).onTransition(
  (state) => {
    console.log(state.value);
  }
);

service.start();

export type ReactOnClickHandler = (event: React.MouseEvent<HTMLElement>)=>void;
export type ReactOnChangeHandler = (event: React.ChangeEvent<HTMLElement>)=>void;
export interface ViewObjectProps {
    id: number,
    text: string,
    onClick: ReactOnClickHandler,
}
 
//FIREBASE AUTH SETUP  
// export const firebaseConfig = getFirebaseConfig();
// firebase.initializeLayout(firebaseConfig);
// export const auth = firebase.auth;
 

function Layout() {

  const [state, setState] = useState(null);

  // useEffect(()=>{
  //   //REGISTER to state change events
  //   observableState.registerListener('Layout',setState);
  //   //Now local 'state' will be synchronized with the state emitted by controller
  // },[]);

  return (
    <Container>
      {/* {Object.keys(state.components).map(componentName => {
        if (!state.components[componentName.enabled]) return <></>;
        return <c[componentName] {...stat.components
          [componentName].props, key: componentName}/>;
      })} */}
    </Container>
  );
}
//this
export default Layout;
