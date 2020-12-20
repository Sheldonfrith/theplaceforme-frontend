
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

const landingEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const landingState = {
    on: { ...landingEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}
const loading_PREF_DefinitionEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const loading_PREF_DefinitionState = {
    on: { ...loading_PREF_DefinitionEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}
const PREF_DefinitionEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const PREF_DefinitionState = {
    on: { ...PREF_DefinitionEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}
const loading_SCORES_EventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const loading_SCORES_State = {
    on: { ...loading_SCORES_EventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}
const SCORES_CommunicationEventHandlers: eventHandlers = {
    ...defaultEventHandlers,
    // define how this state handles events here...
}

const SCORES_CommunicationState = {
    on: { ...SCORES_CommunicationEventHandlers},
    //other state functionality goes here (ex: 'invoke', 'entry', 'exit'...)
}
const states = {
    landing: {...landingState},
    loading_PREF_Definition: {...loading_PREF_DefinitionState},
    PREF_Definition: {...PREF_DefinitionState},
    loading_SCORES: {...loading_SCORES_State},
    SCORES_Communication: {...SCORES_CommunicationState},
}

export default states;

