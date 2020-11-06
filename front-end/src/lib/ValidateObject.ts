export interface Schema {
    [keyName: string]: any,
}

export default function validateObject (objectToValidate: any, schema: Schema){
    const exampleSchema: Schema = {
            eventType: (value: any) => (typeof value === 'string' && value.length<200),
            eventSpecifics: (value: any) => (typeof value === 'string' && value.length<200),
          };
    //object must have identical properties to schema, and value of those properties
    //us run through the function defined in schema, and only valid if that function returns true

    //returns array of error messages if invalid, true if valid
  const validate = (object: any, schema: Schema) => Object.keys(schema).filter(key=> !schema[key](object[key]))
  .map(key=> new Error(`${key} is invalid`));
  const errors = validate(objectToValidate,schema);
  if (errors.length > 0){
      //object is invalid
      return errors.map(error => error.message);
  }
  return true;
  //returns true if valid, otherwise returns a list of the errors found.
}