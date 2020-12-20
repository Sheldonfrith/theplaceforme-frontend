
import { Machine, interpret, assign, spawn, sendParent, AnyEventObject } from 'xstate';
import { PREF_FormMachine } from '../PREF_Form/machine';
import {I_PREF_DefinitionContext}from'./machine';

// cross-state settings

// USE THIS INTERFACE TO REMIND YOURSELF TO HANDLE ALL EVENTS IN ALL STATES
// IF you want an event to not always be handled simply set its name to optional
// here with '?'
interface eventHandlers {
    Success?: any,
    Submit_PREF?: any,
    Update_PREF?:any,
    Reset?: any,
    LoadSavedForm?: any,
}
// define default actions to prevent repetition if multiple states will handle the same 
// event in the same way
const eventHandlerDefaults = {
    
}

// DEFINE ALL YOUR STATES HERE, FOLLOW THE EXAMLPE SYNTAX 
// >> For each state you need an 'EventHandlers' object and 
// >> the state object itself, with the EventHandlers injected
// >> into the 'on' object of the state object

const LoadingFormStateEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
     // '': '',// on entry start loading the form
     Success: 'fillingForm',
     //FAILURE: '',//RETRY
}

const LoadingFormState = {
    on: { ...LoadingFormStateEventHandlers},
    //other state functionality goes here (ex: 'invoke')
}

const FillingFormStateEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    Submit_PREF: sendParent('Submit_PREF'),
    Update_PREF: sendParent((context: I_PREF_DefinitionContext, event: AnyEventObject)=>({...context, type:'Update_PREF', data: context.PREF})),
    Reset: 'loadingForm',
    LoadSavedForm: 'loadingForm',
}
const FillingFormState = {
    activities: ['autoSaving'],
    on: {...FillingFormStateEventHandlers},
    entry: assign({PREF_FormMachine: ()=>spawn(PREF_FormMachine)}),
    exit: assign({PREF_FormMachine: ()=>null}),
}

const states = {
    loadingForm : {
        ...LoadingFormState
    },
    fillingForm: {
        ...FillingFormState
    }
}

export default states;

