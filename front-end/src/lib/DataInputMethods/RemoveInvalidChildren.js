//removes items from the array that are not arrays with length of 2

export default function RemoveInvalidChildren (array){
    return array.filter(arr=>(arr && Array.isArray(arr) && arr.length===2));
}