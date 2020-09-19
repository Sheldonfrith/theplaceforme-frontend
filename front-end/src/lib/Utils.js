export const convertNullsInObject = (object)=>{
    const stringObj = JSON.stringify(object);
    return JSON.parse(stringObj.replace(/"NULL"/g,"null"));
}
export const convertObjectToLowerCase = (object, excludeList)=>{
    const stringObj = JSON.stringify(object).toLowerCase();
    return JSON.parse(stringObj);
}