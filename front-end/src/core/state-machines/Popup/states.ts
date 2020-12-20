
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';

// cross-state settings

// USE THIS INTERFACE TO REMIND YOURSELF TO HANDLE ALL EVENTS IN ALL STATES
// IF you want an event to not always be handled simply set its name to optional
// here with '?'
interface eventHandlers {
    EXAMPLERequiredEvent: any,
    EXAMPLEOptionalEvent?: any,
}
// define default actions to prevent repetition if multiple states will handle the same 
// event in the same way
const defaultEventHandlers = {
    EXAMPLERequiredEvent: {actions: 'EXAMLPEDefaultAction'},
}

// DEFINE ALL YOUR STATES HERE, FOLLOW THE EXAMLPE SYNTAX 
// >> For each state you need an 'EventHandlers' object and 
// >> the state object itself, with the EventHandlers injected
// >> into the 'on' object of the state object

const EXAMPLEEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const EXAMPLEState = {
    on: { ...EXAMPLEEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}

const states = {
    
}

export default states;

