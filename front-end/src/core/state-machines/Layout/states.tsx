
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import {AppMachine}from '../App/machine';
import {LandingPageMachine} from  '../LandingPage/machine';
import React from 'react';
import * as c from '../../../components2';
// cross-state settings

// USE THIS INTERFACE TO REMIND YOURSELF TO HANDLE ALL EVENTS IN ALL STATES
// IF you want an event to not always be handled simply set its name to optional
// here with '?'
interface eventHandlers {
}
// define default actions to prevent repetition if multiple states will handle the same 
// event in the same way
const defaultEventHandlers = {
}

// DEFINE ALL YOUR STATES HERE, FOLLOW THE EXAMLPE SYNTAX 
// >> For each state you need an 'EventHandlers' object and 
// >> the state object itself, with the EventHandlers injected
// >> into the 'on' object of the state object

const loadingEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const loadingState = {
    on: { ...loadingEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}

const landingPageEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const landingPageState = {
    on: { ...landingPageEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
    entry: ['buildLandingPageInitial' ],
}
const appEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const appState = {
    on: { ...appEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
    invoke: {
        src: AppMachine,
        id: 'AppMachine'
    }
}
const states = {
    loading: {...loadingState},
    landingPage: {...landingPageState},
    app: {...appState},
     
}

export default states;

