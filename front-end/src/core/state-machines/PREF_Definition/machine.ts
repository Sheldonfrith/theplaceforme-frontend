import { Machine, interpret, assign, spawn, sendParent} from "xstate";


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
              // '': '',// on entry start loading the form
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
                RESET: 'loadingForm',
                LOADSAVEDFORM: 'loadingForm',
            },
        },
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
