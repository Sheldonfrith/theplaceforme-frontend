
import { useEffect } from "react";
import useHasChanged from './useHasChanged';

//WRITTEN BY SHELDON FRITH
// if dependency is missing throw an error?
// if dependency array is undefined set it to empty array

// automatically wrap it in an async wrapper so async is easier

export default function useMyEffect (triggerVariables: Array<any>, callback: any, dependencies: Array<any>= [], returnFunction?: any){
    //trigger Variable is an array
    //if any item in the array changes the effect will run, otherwise it wont
        //if trigger varables is just set to an array with a single value of 'true'
        //then the use effect will always run (dependent on regular react useEffect run conditions)

        let haveTriggerVariablesChanged: boolean = useHasChanged(triggerVariables);
        if (triggerVariables.length ==1 && triggerVariables[0] === true){
            haveTriggerVariablesChanged = true;
        }
        const effectHook = ()=>{
            if (!haveTriggerVariablesChanged) return;
            const asyncWrapper = async()=>{
                await callback();
            }
            asyncWrapper();
            if (returnFunction !==null){
                return returnFunction;
            }
        }

        useEffect(effectHook, dependencies);
}