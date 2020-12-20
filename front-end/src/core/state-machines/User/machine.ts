
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';
import {activeMachines} from '../App/machine';
import {IActiveMachines}from '../Initialize';
interface IUserContext {
  externalMachines: IActiveMachines,
}

const UserContext: IUserContext = {
  externalMachines: activeMachines
};




export const UserMachine = Machine({
  id: 'User',
  initial: 'loggedOut',
  context:{
    ...UserContext
  },
  type: "parallel",
  states: {
    loading: {

    },
    loggedIn: {

    },
    loggedOut: {

    },
    loggingIn: {

    },
    loggingOut: {

    },
    logInFailure: {

    }
  }
});

