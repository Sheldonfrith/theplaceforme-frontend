import { Machine, interpret, assign, spawn, sendParent, AnyEventObject } from "xstate";
import { SCORES_CommunicationMachine } from '../SCORES_Communication/machine';
import { PREF_DefinitionMachine } from '../PREF_Definition/machine';
import { SCORES_GetterMachine } from '../SCORES_Getter/machine';

// cross-state settings
const requiredEvents = [
    'Login',
    'Logout',
    'Donate',
    'Error',
    'ContactAuthor',
    'ViewSourceCode',
    'ViewMethodology',
    
] as const 
const optionalEvents = [
    'Submit_PREF',
    'Update_PREF',
    'ReturnToGet_PREF',
    'AppLoaded',
] as const
type requiredEventsKeys = typeof requiredEvents[number];
type requiredEventsHandlers = {
    [key in requiredEventsKeys]: any
}
type optionalEventsKeys = typeof optionalEvents[number];
type optionalEventsHandlers = {
    [key in optionalEventsKeys]?: any
}
type eventHandlers = requiredEventsHandlers & optionalEventsHandlers;

const eventHandlerDefaults = {
    Login: { actions: 'login' },
    Logout: { actions: 'logout' },
    Donate: { actions: 'donate' },
    Error: { actions: 'handleError' },
    ContactAuthor: { actions: 'contactAuthor' },
    ViewSourceCode: {actions: 'viewSourceCode'},
    ViewMethodology: {actions: 'viewMethodology'},
}

//loadingApp
const loadingAppEventHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    AppLoaded: {target:'get_PREF'},
}
const loadingAppState = {
    exit: ['updateCurrentUser'],
    entry: [()=>console.log('entered loadingApp state')],
    on: {...loadingAppEventHandlers},

}

// get_PREF
const get_PREF_StateHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    Submit_PREF: 'get_SCORES',
    Update_PREF: assign({
        PREF: (context, event: AnyEventObject) => event.data
    }),
}
const get_PREF_State = {
    on: { ...get_PREF_StateHandlers },
    entry: assign({PREF_DefinitionMachine: ()=> spawn(PREF_DefinitionMachine, 'PREF_DefinitionMachine')}),
    exit: assign({PREF_DefinitionMachine: ()=>null}),
}
// get_SCORES
const get_SCORES_StateHandlers: eventHandlers = {
    ...eventHandlerDefaults
}
const get_SCORES_State = {
    on: { ...get_SCORES_StateHandlers },
    entry: assign({SCORES_GetterMachine: ()=>spawn(SCORES_GetterMachine)}),
    exit: assign({SCORES_GetterMachine: ()=> null}),
}

// communicate_SCORES
const communicate_SCORES_StateHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    ReturnToGet_PREF: 'get_PREF',
}
const communicate_SCORES_State = {
    on: { ...communicate_SCORES_StateHandlers },
    entry: assign({SCORES_CommunicationMachine: ()=>spawn(SCORES_CommunicationMachine)}),
    exit: assign({SCORES_CommunicationMachine: ()=>null}),
}

const states = {
    loadingApp: {
        ...loadingAppState
    },
    get_PREF: {
        ...get_PREF_State
    },
    get_SCORES: {
        ...get_SCORES_State
    },
    communicate_SCORES: {
        ...communicate_SCORES_State
    }
}

export default states;