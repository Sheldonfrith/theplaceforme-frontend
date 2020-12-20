import React, { useEffect, useState, useContext, Suspense, useCallback } from "react";
import firebase from "firebase";
import Container from 'react-bootstrap/Container';
import {getFirebaseConfig} from '../Secrets/FirebaseAuth';
import {useMachine} from '@xstate/react';
import {LayoutMachine} from '../core/state-machines/Layout/machine';
import { Machine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";
import * as c from './index';
import IndividualQuestionSpecificHeader from "./Headers/IndividualQuestion";
import DefaultHeader from "./Headers/Default";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});
// Edit your service(s) here
export const service = interpret(LayoutMachine, { devTools: true }).onTransition(
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

  const [state, send] = useMachine(LayoutMachine);
  const {headers, popups, content, sidebarLeft, sidebarRight, footers} = state.context;
  const [Components, setComponents]= useState(Controller.getAll);


  return (
    <Container>
      {Object.keys(Components).map(componentName => {
        if (!Components[componentName.enabled]) return <></>;
        return <c[componentName] {...Components[componentName].props, key: componentName}/>;
      })}
    </Container>
  );
}

export default Layout;
