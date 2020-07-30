import { Injectable } from '@angular/core';
import { Countries } from './countries';
import { Country } from './country.model';
import * as _ from 'google-libphonenumber';
import { PhoneNumberUtils } from './phone-number-utils';
import { isDefined } from '../../utils';

@Injectable()
export class IntlTelInputService {
  private googlePhoneUtilInstance: _.PhoneNumberUtil;
  private phoneNumberFormat = _.PhoneNumberFormat;
  constructor() {
    this.googlePhoneUtilInstance = _.PhoneNumberUtil.getInstance();
  }
  public fetchCountries(): Array<Country> {
    const tmpCountries: Array<Country> = [];
    Countries.allCountries.forEach(c => {
      const country = new Country();
      country.name = c[0].toString();
      country.iso2 = c[1].toString();
      country.dialCode = c[2].toString();
      country.priority = +c[3] || 0;
      country.areaCode = +c[4] || null;
      country.flagClass = country.iso2.toLocaleLowerCase();
      country.placeHolder = `${this.getPhoneNumberPlaceHolder(
        country.iso2.toUpperCase()
      )}`;
      tmpCountries.push(country);
    });
    return tmpCountries;
  }

  public getCountryCode(input: string): number | undefined {
    if (this.parse(input)) {
      return this.parse(input).getCountryCode();
    }
    return null;
  }

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
  public isValidPhoneNumber(n: _.PhoneNumber) {
    return this.googlePhoneUtilInstance.isValidNumber(n);
  }

  public format(phoneNumber: _.PhoneNumber, format: _.PhoneNumberFormat) {
    return this.googlePhoneUtilInstance.format(phoneNumber, format);
  }
  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      const phoneNumber = this.googlePhoneUtilInstance.parse(
        '90000505',
        countryCode
      );
      return this.format(phoneNumber, this.phoneNumberFormat.NATIONAL);
    } catch (e) {
      return e;
    }
  }
  // tslint:disable-next-line:variable-name
  public isSafeValidPhoneNumber(_phoneNumber: string): boolean {
    const googlePhonelibInstance = _.PhoneNumberUtil.getInstance();
    try {
      let threatedInput: string;
      threatedInput = PhoneNumberUtils.sanitize(_phoneNumber as string);
      const phoneNumber = googlePhonelibInstance.parseAndKeepRawInput(
        threatedInput
      );
      if (!googlePhonelibInstance.isValidNumber(phoneNumber)) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
