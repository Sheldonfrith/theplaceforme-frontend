import { Machine, interpret, assign, spawn, sendParent } from "xstate";
import { I_LOC } from "../../models/LOC";
import { I_LOCS } from "../../models/LOCS";

interface I_SCORES_CommunicationContext {
  selected_LOCS: I_LOC[],
}

const SCORES_CommunicationContext = {
  selected_LOCS: []
};


export const SCORES_CommunicationMachine = Machine<I_SCORES_CommunicationContext>({
  id: 'SCORES_CommunicationMachine',
  initial: 'loading',
  context: {
    ...SCORES_CommunicationContext
  },
  states: {
    loading: {},
   overview: {
     //expose a list with all LOCS and basic SCORES information for each
     //expose actions> 
     on: {
      ShowDetails: {actions: 'showDetails'}, //only if there are some Selected_LOCS
      SetSelected_LOCS: {actions: 'setSelected_LOCS'},
      Edit_PREF: {actions: 'edit_PREF'},
      ReGet_SCORES: {actions: 'reGet_SCORES'},
      Save_PREF: {actions: 'save_PREF'},
      Load_PREF: {actions: 'load_PREF'},
      Donate: {actions: 'donate'},
      ViewOnGitHub: {actions: 'viewOnGitHub'},
      ViewMethodology: {actions: 'viewMethodology'},
      Share_SCORES: {actions: 'share_SCORES'},
      OpenLinkInNewTab: {actions: 'openLinkInNewTab'},
      OpenLinkInCurrentTab: {actions: 'openLinkInCurrentTab'},
     }
   },
   details: {
     on: {
      BackToOverview: 'overview',
      ShowDetails: {actions: 'showDetails'}, //only if there are some Selected_LOCS
      SetSelected_LOCS: {actions: 'setSelected_LOCS'},
      Edit_PREF: {actions: 'edit_PREF'},
      ReGet_SCORES: {actions: 'reGet_SCORES'},
      Save_PREF: {actions: 'save_PREF'},
      Load_PREF: {actions: 'load_PREF'},
      Donate: {actions: 'donate'},
      ViewOnGitHub: {actions: 'viewOnGitHub'},
      ViewMethodology: {actions: 'viewMethodology'},
      Share_SCORES: {actions: 'share_SCORES'},
      OpenLinkInNewTab: {actions: 'openLinkInNewTab'},
      OpenLinkInCurrentTab: {actions: 'openLinkInCurrentTab'},
     }

   },
  },
}, {
  actions: {
    setSelected_LOCS: ()=>{},
    showDetails: ()=>{
      // must be accompanied by the LOCS that the user wants to see details for
      // if there is more than one, they should be presented in comparison view
    },
  }
});
