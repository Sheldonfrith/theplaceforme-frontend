import { Machine, interpret, assign, spawn, sendParent} from "xstate";
import { inspect } from "@xstate/inspect";
import {onboardingMachine} from './onboardingMachine';
import {questionaireMachine}from './questionaireMachine';
import {viewResultsMachine}from'./viewResultsMachine';

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

// SCORE
// Used to refer to whatever information is communicated to the user to indicate the relative compatability 
// of each LOC based on that user's defined PREF, could be a ranking, or a score, percentile, etc. 

const SCORE_GetterContext = {
};


 export const SCORE_GetterMachine = Machine({
   id: 'SCORE_GetterMachine',
   initial: 'getting',
   context: {
     ...SCORE_GetterContext
   },
   states: {
        getting: {
            on: {
                SUCCESS: 'success',
                FAILURE: 'failure'
            }
        },
        success: {
            type: 'final',
        },
        failure: {
            //RETRY
            //AFTER CERTAIN NUMBER OF RETRIES SHOW ERROR TO USER AND GIVE OPTIONS
        }
   }
 })
