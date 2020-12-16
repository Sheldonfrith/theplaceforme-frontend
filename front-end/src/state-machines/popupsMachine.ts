import { Machine, interpret, assign, spawn, sendParent} from "xstate";
import { inspect } from "@xstate/inspect";
import {onboardingMachine} from './onboardingMachine';
import {questionaireMachine}from './questionaireMachine';
import {viewResultsMachine}from'./viewResultsMachine';

const globalContext = {
  loggedIn: false,
  localStorageHasData: false
};

const onboardingState = {
    on: {
        STARTQUESTIONAIRE: 'questionaire',
      },
      invoke: {
        id: 'onboardingMachine',
        src: onboardingMachine,
      }
}
const questionaireState= {
 on: {
         VIEWRESULTS: 'resultsOverview',
         HOME: 'onboarding',
       }
}
const resultsOverviewState = {
 on: {
         EDITQUESTIONAIRE: 'questionaire',
         HOME: 'onboarding',
       }
}
const popupMenuState = {
    on: {
        CLICKOUTSIDE: 'previous'
    }
}
const detailedResultsState = {}

export const popupsMachine = Machine({
   id: 'views',
   initial: 'onboarding',
   states: {
     onboarding: {
         ...onboardingState
     },
     questionaire: {
      ...questionaireState
     },
     resultsOverview: {
        ...resultsOverviewState
     },
     popupMenu: {
        ...popupMenuState
     },
     detailedResults: {
        ...detailedResultsState
     }
   }
 })
