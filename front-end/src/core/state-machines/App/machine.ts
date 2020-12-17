import { Machine, interpret, assign, spawn, sendParent } from "xstate";
import { PREF, I_PREF } from "../../models/PREF";
import { SCORES, I_SCORES } from "../../models/SCORES";
import { LOCS, I_LOCS } from '../../models/LOCS';
import { Models, IModels } from '../../models/Models';
import states from './states';
import actions from './actions';

//SUMMARY: This contains the highest level of abstraction in the application. This app gets user PREFS and 
// then uses them to communicate compatability SCOREs to users for each LOC in LOCS. 

//KEYWORDS:
//Abbreviations specific to this application, to describe a concept very concisely and improve readability:

//All keywords defined here are always separated from other characters by an underscore, but no 
// underscore is used at the beginning or ending of a string... for example:
// 'LOC_PREF_name', or 'thisIsThe_PREF_Object' or 'LOCS'

// LOCS
// The set of all physical locations this application evaluates for compatability with the
// user defined preferences, for example all Countries on Earth

// LOC
// A single physical location within the LOCS set, for example a single country or city

// PREF
// The user defined preferences used by which LOCS are evaulated for compatability with. For example a user 
// could like locations larger than 3 square miles... > three square miles would be their PREF

// SCORES
// Used to refer to whatever information is communicated to the user to indicate the relative compatability 
// of each LOC based on that user's defined PREF, could be a ranking, or a score, percentile, etc.

interface IGlobalContext {
  user: any,
  models: IModels,
}

const globalContext: IGlobalContext = {
  user: null,
  models: new Models({ models: [new LOCS(), new PREF(), new SCORES()] }),
};

export const appMachine = Machine<IGlobalContext>({
  id: 'app',
  initial: 'get_PREF',
  context: {
    ...globalContext
  },
  states: {
    ...states
  }
}, {
  actions: { ...actions }
});



// Edit your service(s) here
export const service = interpret(appMachine, { devTools: true }).onTransition(
  (state) => {
    // console.log(state.value);
  }
);


