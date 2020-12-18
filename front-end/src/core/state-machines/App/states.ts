import { Machine, interpret, assign, spawn, sendParent, AnyEventObject } from "xstate";
import { SCORES_CommunicationMachine } from '../SCORES_Communication/machine';
import { PREF_DefinitionMachine } from '../PREF_Definition/machine';
import { SCORES_GetterMachine } from '../SCORES_Getter/machine';

// cross-state settings
interface eventHandlers {
    Login: any,
    Logout: any,
    Donate: any,
    Error: any,
    ContactAuthor: any,
    ViewSourceCode: any,
    ViewMethodology: any,
    Submit_PREF?: any,
    Update_PREF?: any,
    ReturnToGet_PREF?: any,
    always?: any,
    AppLoaded?: any,
}

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
    exit: ['getCurrentUser'],
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
    invoke: {
        src: PREF_DefinitionMachine,
        id: 'PREF_DefinitionMachine',
    }
}
// get_SCORES
const get_SCORES_StateHandlers: eventHandlers = {
    ...eventHandlerDefaults
}
const get_SCORES_State = {
    on: { ...get_SCORES_StateHandlers },
    invoke: {
        src: SCORES_GetterMachine,
        id: 'SCORES_GetterMachine',
        onDone: { target: 'communicate_SCORES' },
    }
}

// communicate_SCORES
const communicate_SCORES_StateHandlers: eventHandlers = {
    ...eventHandlerDefaults,
    ReturnToGet_PREF: 'get_PREF',
}
const communicate_SCORES_State = {
    on: { ...communicate_SCORES_StateHandlers },
    invoke: {
        src: SCORES_CommunicationMachine,
        id: 'SCORES_CommunicationMachine',
    }
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