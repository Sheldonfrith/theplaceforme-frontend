interface ValidationSchema {
  [key: string]: (arg0: any) => boolean,
}
interface ValidationObject {
  [key: string]: any
}

const getErrors = (object: ValidationObject, schema: ValidationSchema): Error[] => {
  return Object.keys(schema).filter(key=> !schema[key](object[key])).map(key=> new Error(`${key} is invalid`));
}

export default function validateObject (objectToValidate: ValidationObject, schema: ValidationSchema): Error[]|true {
    const exampleSchema = {
            eventType: (value:any) => (typeof value === 'string' && value.length<200),
            eventSpecifics: (value:any) => (typeof value === 'string' && value.length<200),
          };
    //object must have identical properties to schema, and value of those properties
    //us run through the function defined in schema, and only valid if that function returns true

  const errors =getErrors(objectToValidate,schema);
  if (errors.length < 1) return true;
  return errors;
}