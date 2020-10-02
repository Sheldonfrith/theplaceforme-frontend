
import { useEffect } from "react";

//WRITTEN BY SHELDON FRITH
// if dependency is missing throw an error?
// if dependency array is undefined set it to empty array

// automatically wrap it in an async wrapper so async is easier

export default function useMyEffect (triggerVariables, callback, dependencies = []){
    //trigger Variable is an array
    //each item in the array is a variable set by the useHasChanged hook that evaluates to TRUE if it has changed
    //ALL items in the array must be true for this useEffect to run
        const effectHook = ()=>{
            const unchangedVariables = triggerVariables.filter(item =>!item);
            if (unchangedVariables.length>0) return;
            const asyncWrapper = async()=>{
                await callback();
            }
            asyncWrapper();
        }

        useEffect(effectHook, dependencies);
}