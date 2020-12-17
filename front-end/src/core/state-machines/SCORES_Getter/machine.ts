import { Machine, interpret, assign, spawn, sendParent} from "xstate";


const SCORES_GetterContext = {
};


 export const SCORES_GetterMachine = Machine({
   id: 'SCORES_GetterMachine',
   initial: 'getting',
   context: {
     ...SCORES_GetterContext
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
