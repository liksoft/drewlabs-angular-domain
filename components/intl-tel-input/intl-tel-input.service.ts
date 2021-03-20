import { Inject, Injectable } from '@angular/core';
import { Country } from './country.model';
import { PhoneNumberUtil, PhoneNumberFormat, PhoneNumber } from 'google-libphonenumber';
import { isDefined } from '../../utils';
import { getPhoneNumberPlaceHolder, phoneNumberAsString, safeValidatePhoneNumber } from './helpers';

@Injectable()
export class IntlTelInputService {

  private googlePhoneUtilInstance: PhoneNumberUtil;

  constructor(
    @Inject('TELINPUT_COUNTRIES') private _countries: Country[]
  ) {
    this.googlePhoneUtilInstance = PhoneNumberUtil.getInstance();
  }

  public fetchCountries(): Array<Country> {
    return this._countries;
  }

  public getCountryCode(input: string): number | undefined {
    if (this.parse(input)) {
      return this.parse(input).getCountryCode();
    }
    return null;
  }

  // tslint:disable-next-line: typedef
  public parse(input: string) {
    if (!isDefined(input)) {
      return null;
    }
    try {
      const tmpInput = input.toString().startsWith('+') || input.toString().startsWith('00') ? input : `+${input}`;
      return this.googlePhoneUtilInstance.parseAndKeepRawInput(tmpInput);
    } catch (e) {
      return null;
    }
  }
  public isValidPhoneNumber(n: PhoneNumber): boolean {
    return this.googlePhoneUtilInstance.isValidNumber(n);
  }

  public format = (phoneNumber: PhoneNumber, format: PhoneNumberFormat) => phoneNumberAsString(phoneNumber, format);

  public isSafeValidPhoneNumber = (_phoneNumber: string): boolean => safeValidatePhoneNumber(_phoneNumber);

  protected getPhoneNumberPlaceHolder = (countryCode: string): string => getPhoneNumberPlaceHolder(countryCode, PhoneNumberFormat.NATIONAL);
}
