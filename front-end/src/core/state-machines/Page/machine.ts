
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';
import {IActiveMachines} from '../Initialize';
import {activeMachines}from '../App/machine';

interface IPageContext {
  externalMachines: IActiveMachines
}

const PageContext: IPageContext = {
  externalMachines: activeMachines
};

export const PageMachine = Machine<IPageContext>({
  id: 'Page',
  initial: 'landing',
  context: {...PageContext},
states: {...states}
}, {
actions: { ...actions }
});

