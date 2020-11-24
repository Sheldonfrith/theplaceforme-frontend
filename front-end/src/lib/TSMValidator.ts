import createValidator, { registerType } from 'typecheck.macro'

export default function isType<T> (object: any): boolean {
    registerType('T');
    const validator = createValidator<T>();
    return validator(object);
}