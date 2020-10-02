import GetCountries from './GetCountries';
import FindProperCountryName from './FindProperCountryName';

export default function ConvertSynonyms(array){
    const countriesMaster = GetCountries();
    //if the proper country name corresponding to the synonym is already in the
    //list then the synonym and its data are discarded, after a console.log
    const existingNames = array.map(arr=>arr[0]);
    const newArrays =[];
    console.log(countriesMaster);
    const filteredArray = array.filter(arr=>{
        //if the name is on the master list leave it alone
        if (countriesMaster.includes(arr[0])) return true;
        //otherwise try to find a synonym for it
        const parent = FindProperCountryName(arr[0]);
        if (parent){
            //THERE IS A SYNONYM
            //does it already exist in the array?
            if (existingNames.includes(parent)){
                // do nothing but remove this node
                return false;
            } else {
                //change the name and keep the node
                newArrays.push([parent,arr[1]]);
                return false;
            }
        }
        //if no synonym is found leave it alone
        return true;
    })
    //reinsert the changed synonym arrays
    newArrays.forEach(arr=>filteredArray.push(arr));
    return filteredArray;
}