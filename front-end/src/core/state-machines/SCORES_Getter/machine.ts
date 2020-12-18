
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';

interface ISCORES_GetterContext {
}

const SCORES_GetterContext: ISCORES_GetterContext = {
};

export const SCORES_GetterMachine = Machine<ISCORES_GetterContext>({
  id: 'SCORES_Getter',
  initial: 'getting',
  context: SCORES_GetterContext,
  states: states,
}, {
  actions: actions,
});

