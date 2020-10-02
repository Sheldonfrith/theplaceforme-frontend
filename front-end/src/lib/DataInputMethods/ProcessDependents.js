import DependentCombine from './DependentCombine';
import FindParentCountry from './FindParentCountry';

export default function ProcessDependents(array, method){
    const dependents = array.map(arr=>{
        const parent = FindParentCountry(arr[0]);
        if (!parent) return null; //not a dependent
        //is a dependent, put its info in the list
        return [parent,arr[0],arr[1]];
    });
    const filteredDependents = dependents.filter(arr => arr);
    //mutate the array list
    filteredDependents.forEach(arr=>{
        let parentIndex = array.findIndex(item => item[0]===arr[0]);
        if (parentIndex<0) {
            //parent doesn't yet exist, create it
            array.push([arr[0],0]);
            parentIndex = array.length-1;
        }
        const parentData = array[parentIndex]?array[parentIndex][1]:0;
        array = DependentCombine(array,parentIndex,parentData,arr[1],arr[2],method);
    });
    return array;
}