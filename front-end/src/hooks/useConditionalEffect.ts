import {useDeltaArray, useConditionalEffect} from 'react-delta';

// simple call to react-delta but with an automatic async wrapper

export default function customUseEffect (triggerVariables: any[], callback: (... args: any[]) => void){
    const delta: any[] = useDeltaArray(triggerVariables, true);
    let triggerVariablesHaveChanged: boolean = false;    
    delta.forEach(obj => {
        if (!obj) return;
        if (obj.prev !== obj.curr){
            triggerVariablesHaveChanged = true;
        }
        });
    useConditionalEffect(()=>{
        const asyncWrapper = async ()=>{
            const cleanup: any = await callback();
            if (cleanup) return cleanup;
        }
        const cleanup =  asyncWrapper();
        if (cleanup) return cleanup;
    }, triggerVariablesHaveChanged);
};