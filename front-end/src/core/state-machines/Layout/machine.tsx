
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import states from './states';
import actions from './actions';
import React from 'react'; 


export interface ILayoutContext {
  headers: JSX.Element[],
  popups: JSX.Element,
  content: JSX.Element,
  sidebarLeft: JSX.Element,
  sidebarRight: JSX.Element,
  footers: JSX.Element[],
}

export const nullElement = (id: string)=><div id={id} key={id}></div>;

const LayoutContext: ILayoutContext = {
  headers: [nullElement('headers')],
  popups: nullElement('popups'),
  content: nullElement('content'),
  sidebarLeft: nullElement('sidebarLeft'),
  sidebarRight: nullElement('sidebareRight'),
  footers: [nullElement('footers')],
};

export const LayoutMachine = Machine<ILayoutContext>({
  id: 'Layout',
  initial: 'landingPage',
  context: {...LayoutContext},
states: {...states}
}, {
actions: { ...actions }
});

