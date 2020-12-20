
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';
import {activeMachines} from '../App/machine';
import {IActiveMachines}from '../Initialize';

interface IPopupContext {
  externalMachines: IActiveMachines
}

const PopupContext: IPopupContext = {
  externalMachines: activeMachines,
};

export const PopupMachine = Machine<IPopupContext>({
  id: 'Popup',
  initial: 'none',
  context: {
    ...PopupContext
  },
  states: {
    none: {
      on: {
        account: [
          {target: 'accountPopup', cond: 'isLoggedIn'}
        ]
      }
    },
    loading: {},
    accountPopup: {},// this should only be enabled if UserMachine is loggedIn
    genericPopup: {},
  }
},{
  guards:{
    isLoggedIn: (context) => context.externalMachines.user.state.matches('loggedIn'),
  }
});
