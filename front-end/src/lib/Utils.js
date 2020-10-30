export const convertNullsInObject = (object)=>{
    const stringObj = JSON.stringify(object);
    return JSON.parse(stringObj.replace(/"NULL"/g,"null"));
}
export const convertObjectToLowerCase = (object, excludeList)=>{
    const stringObj = JSON.stringify(object).toLowerCase();
    return JSON.parse(stringObj);
}
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}