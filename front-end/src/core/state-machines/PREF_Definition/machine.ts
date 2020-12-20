
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';

export interface I_PREF_DefinitionContext {
  PREF: any
  autoSaveInterval: number
  PREF_FormMachine: Actor | null,
}

const PREF_DefinitionContext: I_PREF_DefinitionContext = {
  PREF : null,
    autoSaveInterval: 5000,
    PREF_FormMachine: null,
};

export const PREF_DefinitionMachine = Machine<I_PREF_DefinitionContext>({
  id: 'PREF_Definition',
  initial: 'loadingForm',
  context: {
    ...PREF_DefinitionContext
  },
  states: {
    ...states
  }
}, {
  actions: { ...actions },
  activities: {
    autoSaving: (context, activity) => {
      const interval = setInterval(() => {
        //TODO save_PREF
        console.log('testing autosave interval');
      }, context.autoSaveInterval);
      return clearInterval(interval);
    }
  },
});

