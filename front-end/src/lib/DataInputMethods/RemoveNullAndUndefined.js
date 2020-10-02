export default function RemoveNullAndUndefined(array){
    return array.filter(item => (item !== null && item !== undefined));
}