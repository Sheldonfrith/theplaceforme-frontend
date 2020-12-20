
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';
import { ModelAsViewObjectProps } from '../../HelperTypes';

interface IPREF_FormContext {
  allCategories: any,
  currentCategory: ModelAsViewObjectProps,
  questionsInCurrentCategory: ModelAsViewObjectProps[],
}

const PREF_FormContext: IPREF_FormContext = {
  allCategories: {},
  currentCategory: {id: 0, text: ''},
  questionsInCurrentCategory: [{id:0,text:''}],
};

export const PREF_FormMachine = Machine<IPREF_FormContext>({
  id: 'PREF_Form',
  initial: 'initialState',
  context: {...PREF_FormContext},
states: {...states}
}, {
actions: { ...actions }
});

