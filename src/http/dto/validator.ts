import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as i18nIsoCountries from 'i18n-iso-countries';

import { ECountryCode } from '#http/dto/udemy.dto';

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
          const allowedCountryCodeArray = Object.keys(ECountryCode);
          const isAllowedCountryCode = allowedCountryCodeArray.includes(value);

          return isAllowedCountryCode;
        },
      },
    });
  };
}
