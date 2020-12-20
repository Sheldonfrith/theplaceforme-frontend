
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';

interface IViewContext {
}

const ViewContext: IViewContext = {
};

export const ViewMachine = Machine<IViewContext>({
  id: 'View',
  initial: 'initialState',
  context: {...ViewContext},
states: {...states}
}, {
actions: { ...actions }
});

