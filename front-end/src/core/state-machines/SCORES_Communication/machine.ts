
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';

interface ISCORES_CommunicationContext {
}

const SCORES_CommunicationContext: ISCORES_CommunicationContext = {
};

export const SCORES_CommunicationMachine = Machine<ISCORES_CommunicationContext>({
  id: 'SCORES_Communication',
  initial: 'initialState',
  context: {
    ...SCORES_CommunicationContext
  },
  states: {
    ...states
  }
}, {
  actions: { ...actions }
});

