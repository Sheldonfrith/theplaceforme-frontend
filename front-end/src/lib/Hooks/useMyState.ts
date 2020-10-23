import {useState, useCallback} from 'react';
import _ from 'lodash';

//WRITTEN BY SHELDON FRITH

// this should alter the regular useState
//hook so that the setState callback function
//(ex: setAnimals(prev => return prev++))
//is easier to write, without having to worry about mutations or cloning arrays, etc.
// so the following should work:
// const [numbers, setNumbers] = useMyState([1,2,3,4]);
// setNumbers(prev=>prev.push(6));
//setNumbers(prev=>prev.splice(1,1));

//if there is no return value, return 'prev'
// immediately clone the previous value so it can be safely worked on ex: const newPrev = [...prev];
// return the cloned version, not the original so that react detects the change in state

//NOT currently working
export default function useMyState<T extends unknown>(initialState: T){

    // type thisStateType = InstanceType<typeof stateType>;

    //stateType can be: boolean, number, string, array, or object
    const [stateReference, defaultSetter] = useState<T>(initialState);

    // type stateSetterParamType = thisStateType | ((prev: thisStateType)=>any);
    // type stateSetterParamType = T | ((prev: T)=>T);

    const stateSetter = (newValue: T, callback: (prev: T)=>T):void =>{

        //is it a function or a simple value
        if (!callback){
            //its NOT a function, just do a simple state update
            defaultSetter(newValue);
            return;
        } else {
            //it IS a function, here is where things get interesting
            defaultSetter((prev: T):T =>{
                //copy (dereferences) the existing state
                //so it can be safely passed to the callback and react will detect the change
                const temp: T = _.clone(prev);
                let result: T = callback(temp);
                return result;
            });
        }
        return;
    }
    return [stateReference, stateSetter];
}