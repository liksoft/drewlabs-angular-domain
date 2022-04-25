import { Inject, Injectable } from '@angular/core';
import { Country } from './model';
import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumber,
} from 'google-libphonenumber';
import {
  getPhoneNumberPlaceHolder,
  phoneNumberAsString,
  safeValidatePhoneNumber,
} from './helpers';
import { COUNTRIES } from './types';

@Injectable()
export class IntlTelInputService {
  private googlePhoneUtilInstance: PhoneNumberUtil;

  constructor(@Inject(COUNTRIES) private countries: Country[]) {
    this.googlePhoneUtilInstance = PhoneNumberUtil.getInstance();
  }

  public fetchCountries(): Array<Country> {
    return this.countries;
  }

  public getCountryCode(input: string): number | undefined {
    if (this.parse(input)) {
      return this.parse(input)?.getCountryCode();
    }
    return undefined;
  }

  // tslint:disable-next-line: typedef
  public parse(input: string) {
    if (typeof input === 'undefined' || input === null) {
      return undefined;
    }
    try {
      const tmpInput =
        input.toString().startsWith('+') || input.toString().startsWith('00')
          ? input
          : `+${input}`;
      return this.googlePhoneUtilInstance.parseAndKeepRawInput(tmpInput);
    } catch (e) {
      return undefined;
    }
  }
  public isValidPhoneNumber(n: PhoneNumber): boolean {
    return this.googlePhoneUtilInstance.isValidNumber(n);
  }

  public format = (phoneNumber: PhoneNumber, format: PhoneNumberFormat) =>
    phoneNumberAsString(phoneNumber, format);

  public isSafeValidPhoneNumber = (_phoneNumber: string): boolean =>
    safeValidatePhoneNumber(_phoneNumber);

  protected getPhoneNumberPlaceHolder = (countryCode: string) =>
    getPhoneNumberPlaceHolder(countryCode, PhoneNumberFormat.NATIONAL);
}
