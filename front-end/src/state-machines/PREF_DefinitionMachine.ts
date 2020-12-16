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

interface I_PREF_DefinitionContext {
    PREF: any
    autoSaveInterval: number
}
const PREF_DefinitionContext = {
    PREF : null,
    autoSaveInterval: 5000,
};


 export const PREF_DefinitionMachine = Machine<I_PREF_DefinitionContext>({
   id: 'PREF_DefinitionMachine',
   initial: 'loadingForm',
   context: {
     ...PREF_DefinitionContext
   },
   states: {
       loadingForm: {
           on: {
               //'': '',// on entry start loading the form
               SUCCESS: 'fillingForm',
               //FAILURE: '',//RETRY
           }
       },
        fillingForm: {
            activities: ['autoSaving'],
            on: {
                SUBMIT: {
                    actions: ['update_PREF','submit']
                },
                RESET: 'loadingForm'
            },
        },
    //get PREF definition process
    //send PREF to SCORE calculator

    //DoneDefiningPreferences: 'communicateLocationCompatabilities',
    //allow login for manual saves or more robust auto saves
    //allow loading previous preferences
     
   }
 },
 {
     actions: {
         submit: sendParent({type: 'SUBMIT'}),
         update_PREF: sendParent((context)=>({type: 'UPDATE_PREF', data: context.PREF})),
         //TODO save_PREF:  
     },
     activities: {
        autoSaving: (context, activity)=>{
            const interval = setInterval(()=>{
                //TODO save_PREF
                console.log('testing autosave interval');
            },context.autoSaveInterval);
            return clearInterval(interval);
        }
     }
 });


 const get_PREF= ()=>{

 }
