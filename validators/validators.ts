import { AbstractControl, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { JSDate } from '../utils';
import { isDefined } from '../utils/types/type-utils';


export class CustomValidators {
  static Match(control: string, otherControl: string) {
    return (controlGroup: AbstractControl) => {
      const firstControlValue = controlGroup.get(control)?.value === '' ? undefined : controlGroup.get(control)?.value;
      const otherControlValue = controlGroup.get(otherControl)?.value === '' ? undefined : controlGroup.get(otherControl)?.value;
      if ((!isDefined(firstControlValue) && !isDefined(otherControlValue))) {
        return null;
      }
      if (firstControlValue !== otherControlValue) {
        return { Match: true };
      } else {
        return null;
      }
    };
  }

  static ValidateUrl(control: AbstractControl) {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && !validator['required']) {
        return null;
      }
    }
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
      return { validUrl: true };
    }
    return null;
  }

  static minDate(minDate: string | Date): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.validator) {
        if (control.value && JSDate.isAfter(minDate, control.value)) {
          return { minDate };
        }
      }
      return null;
    };
  }

  static maxDate(maxDate: string | Date): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.validator) {
        if (control.value && JSDate.isBefore(maxDate, control.value)) {
          return { maxDate };
        }
      }
      return null;
    };
  }

  static numeric(control: AbstractControl) {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && !validator['required']) {
        return null;
      }
      const value = parseInt(control.value, 10);
      if (isNaN(value)) {
        return { numeric: true };
      } else {
        return null;
      }
    }
    return null;
  }

  static ValidateBetween(min: number, max: number) {
    return (control: AbstractControl) => {
      if (control.validator && control.value) {
        const validator = control.validator({} as AbstractControl);
        if (validator && !validator['required']) {
          return null;
        }
        if (+control.value >= min && +control.value <= max) {
          return null;
        }
        return { notBetween: true };
      }
      return null;
    };
  }

  static ValidateMin(min: number) {
    return (control: AbstractControl) => {
      if (control.validator && control.value) {
        const validator = control.validator({} as AbstractControl);
        if (validator && !validator['required']) {
          return null;
        }
        if (+control.value >= min) {
          return null;
        }
        return { min };
      }
      return null;
    };
  }

  static ValidateMax(max: number) {
    return (control: AbstractControl) => {
      if (control.validator && control.value) {
        const validator = control.validator({} as AbstractControl);
        if (validator && !validator['required']) {
          return null;
        }
        if (+control.value <= max) {
          return null;
        }
        return { max };
      }
      return null;
    };
  }

  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
