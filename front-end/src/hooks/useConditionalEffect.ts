import React, {useState}from 'react';
import {useDelta, useConditionalEffect} from 'react-delta';

// simple call to react-delta but with an automatic async wrapper

export default function useCustomEffect (triggerVariables: any[], callback: (...args: any[]) => void, cleanupCallback?: (...args: any[]) => void){
    const delta: any = useDelta(JSON.stringify(triggerVariables), {deep: true});
    useConditionalEffect(()=>{
        const asyncWrapper = async ()=>{
            const cleanup: any = await callback();
            if (cleanup) return cleanup;
        }
        asyncWrapper().then(returnVal=>returnVal);
        if (cleanupCallback) return cleanupCallback;
    }, !!delta);
};