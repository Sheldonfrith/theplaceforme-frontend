
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';

interface ILandingPageContext {
}

const LandingPageContext: ILandingPageContext = {
};

export const LandingPageMachine = Machine<ILandingPageContext>({
  id: 'LandingPage',
  initial: 'initialState',
  context: {...LandingPageContext},
states: {...states}
}, {
actions: { ...actions }
});

