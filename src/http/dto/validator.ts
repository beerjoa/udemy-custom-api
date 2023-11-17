import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as i18nIsoCountries from 'i18n-iso-countries';

export function IsCountryCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCountryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const countryCodeRegex = /^[A-Z]{2}$/;
          const _isValidRegex = countryCodeRegex.test(value);
          const _isValidRegion = i18nIsoCountries.getName(value, 'en') !== undefined;

          return _isValidRegex && _isValidRegion;
        },
      },
    });
  };
}

// for US region
export function IsCountryCodeOfUSRegion(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCountryCodeOfUSRegion',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const _USCodeCheck = value === 'US';

          return _USCodeCheck;
        },
      },
    });
  };
}
