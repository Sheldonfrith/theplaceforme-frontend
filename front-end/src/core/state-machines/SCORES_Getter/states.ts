
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';

// cross-state settings

// USE THIS INTERFACE TO REMIND YOURSELF TO HANDLE ALL EVENTS IN ALL STATES
// IF you want an event to not always be handled simply set its name to optional
// here with '?'
interface eventHandlers {
    SuccessfullyGot_SCORES?: any,
    ErrorGetting_SCORES?: any,
}
// define default actions to prevent repetition if multiple states will handle the same 
// event in the same way
const eventHandlerDefaults = {
}

const gettingEventHandlers: eventHandlers ={
    SuccessfullyGot_SCORES: 'success',
    ErrorGetting_SCORES: 'failure,'
}

const gettingState = {
    on: {...gettingEventHandlers},
}

const successEventHandlers: eventHandlers = {

}
const successState = {
    on: {...successEventHandlers},
}
const failureEventHandlers: eventHandlers = {

}
const failureState = {
    on: {...failureEventHandlers},
}

const states = {
    getting: gettingState,
    success: successState,
    failure: failureState,
}

export default states;

