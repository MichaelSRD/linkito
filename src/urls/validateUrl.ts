import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, } from 'class-validator';

@ValidatorConstraint({ name: 'isValidUrl', async: false })
export class validateUrl implements ValidatorConstraintInterface {
  validate(text: string, ) {

    const urlRegex = /^(?:https?:\/\/)?(?:[a-zA-Z0-9-._~!$&'*,;=:]+)(?:\/[a-zA-Z0-9-_~!$&'*,;=:@#.]*)*$/;
    return urlRegex.test(text); // for async validations you must return a Promise<boolean> here
  }
}

export function IsUrlValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validateUrl,
    });
  };
}