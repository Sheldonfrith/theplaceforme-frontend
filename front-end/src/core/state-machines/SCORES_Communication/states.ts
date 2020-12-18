
import { Details } from '@material-ui/icons';
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';

// cross-state settings

// USE THIS INTERFACE TO REMIND YOURSELF TO HANDLE ALL EVENTS IN ALL STATES
// IF you want an event to not always be handled simply set its name to optional
// here with '?'
interface eventHandlers {
    ShowDetails?: any,
    SetSelected?: any,
    Edit_PREF: any,
    ReGet_SCORES: any,
    Save_PREF: any,
    Load_PREF: any,
    Share_SCORES?:any,

}
// define default actions to prevent repetition if multiple states will handle the same 
// event in the same way
const eventHandlerDefaults = {
    ShowDetails: {actions: 'showDetails'}, //only if there are some Selected_LOCS
    SetSelected_LOCS: {actions: 'setSelected_LOCS'},
    Edit_PREF: {actions: 'edit_PREF'},
    ReGet_SCORES: {actions: 'reGet_SCORES'},
    Save_PREF: {actions: 'save_PREF'},
    Load_PREF: {actions: 'load_PREF'},
    Share_SCORES: {actions: 'share_SCORES'},
}

// DEFINE ALL YOUR STATES HERE, FOLLOW THE EXAMLPE SYNTAX 
// >> For each state you need an 'EventHandlers' object and 
// >> the state object itself, with the EventHandlers injected
// >> into the 'on' object of the state object

const LoadingStateEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    // define how this state handles events here...
}

const LoadingState = {
    on: { ...LoadingStateEventHandlers},
    //other state functionality goes here (ex: 'invoke')
}
const OverviewStateEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
}
const OverviewState = {
    on: {...OverviewStateEventHandlers},
}
const DetailsStateEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
}
const DetailsState = {
    on: {...DetailsStateEventHandlers},
}
const states = {
    Loading : {
        ...LoadingState
    },
    Overview: {
        ...OverviewState
    },
    Details: {
        ...DetailsState
    }

}

export default states;

