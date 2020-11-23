
//converts everything in an object to lower case
export const convertObjectToLowerCase = (object: JSON) : JSON =>{
  const stringObj: string = JSON.stringify(object).toLowerCase();
  return JSON.parse(stringObj);
}

export function toTitleCase(str:string):string {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export const isStringValidJSON = (str: string ) =>{
  try {
    JSON.parse(str);
  }  catch {
    return false;
  }
  return true;
}
export const convertToJSON = (object: any) => {
  const stringified = JSON.stringify(object);
  if (isStringValidJSON(stringified)) return JSON.parse(stringified);
  throw new Error('object is not valid JSON');
}

export const convertJSONToObjectOrArray = (json: JSON)=>{
  
}