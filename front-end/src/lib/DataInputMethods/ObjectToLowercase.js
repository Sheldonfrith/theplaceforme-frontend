export default function ObjectToLowerCase  (object){
    const stringObj = JSON.stringify(object).toLowerCase();
    return JSON.parse(stringObj);
}