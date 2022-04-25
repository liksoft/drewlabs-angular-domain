import { AbstractControl } from '@angular/forms';
import * as _ from 'google-libphonenumber';
import { sanitize } from './helpers';

export class PhoneNumberValidator {
  // tslint:disable-next-line: typedef
  static ValidatePhoneNumber(control: AbstractControl) {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && !validator['required']) {
        return null;
      }
    }
    const googlePhonelibInstance = _.PhoneNumberUtil.getInstance();
    try {
      let threatedInput: string;
      if (typeof control.value === 'undefined' || control.value === null) {
        return null;
      }
      threatedInput = sanitize(String(control.value) as string);
      const phoneNumber =
        googlePhonelibInstance.parseAndKeepRawInput(threatedInput);
      if (!googlePhonelibInstance.isValidNumber(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }
      return null;
    } catch (e) {
      return { invalidPhoneNumber: true };
    }
  }
}
