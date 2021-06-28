import { AbstractControl, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/core/http-request.service';
import { isDefined } from '../utils/types/type-utils';
import { MomentUtils } from '../utils/datetime/moment-utils';

@Injectable({
  providedIn: 'root'
})
export class UniqueValueService {

  public readonly path: string;

  constructor(private client: HttpRequestService) {
    this.path = 'is_unique';
  }

  /**
   * @description Checks if a control value is unique on the ressources server
   * @param property [[string]]
   * @param value [[string|any]]
   * @param entity [[entity]]
   */
  async verify(entity: string, property: string, value: string | number) {
    return true;
    // const query = isDefined(entity) ? `?property=${property}&value=${value}&entity=${entity}` : `?property=${property}&value=${value}`;
    // try {
    //   // TODO Implements unique value validation method
    //   // const result = await loadThroughHttpRequest(this.client, `${this.path}${query}`);
    //   // return isDefined(result) ? true : false;
    // } catch (error) {
    //   return true;
    // }
  }
}

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
      if (validator && !validator.required) {
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
        if (control.value && MomentUtils.isAfter(minDate, control.value)) {
          return { minDate };
        }
      }
      return null;
    };
  }

  static maxDate(maxDate: string | Date): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.validator) {
        if (control.value && MomentUtils.isBefore(maxDate, control.value)) {
          return { maxDate };
        }
      }
      return null;
    };
  }

  static numeric(control: AbstractControl) {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && !validator.required) {
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
        if (validator && !validator.required) {
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
        if (validator && !validator.required) {
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
        if (validator && !validator.required) {
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

  /**
   * @description Checks if the value of the current control already exists in the database.
   * @param service [[UniqueValueService]]
   * @param entity [[string]]
   * @param column [[string]]
   */
  static createAsycUniqueValidator(service: UniqueValueService, entity: string, column: string) {
    return async (control: AbstractControl) => {
      if (!isDefined(control.value) || control.value === '') {
        return null;
      }
      const res = await service.verify(entity, column, control.value);
      const errors = res ? null : { notUnique: {value: control.value} };
      return errors;
    };
  }
}
