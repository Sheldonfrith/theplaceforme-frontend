export default function RemoveAccents(array){
    return array.map(arr=>{
        const thisName = arr[0];
        thisName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return [thisName, arr[1]];
    })   
}