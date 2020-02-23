import { AbstractControl, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/core/http-request.service';
import { RequestClient } from '../contracts/abstract-request-client';
import { ResponseData, IResponseBody, ResponseBody } from '../http/contracts/http-response-data';
import { isDefined } from './type-utils';
import { MomentUtils } from './moment-utils';

@Injectable()
export class UniqueValueService extends RequestClient {

  public readonly path: string;

  constructor(private client: HttpRequestService) {
    super();
    this.path = '/is_unique';
  }

  /**
   * @description Checks if a control value is unique on the ressources server
   * @param property [[string]]
   * @param value [[string|any]]
   * @param entity [[entity]]
   */
  verify(property: string, value: any, entity: string = null) {
    const query = isDefined(entity) ? `?property=${property}&value=${value}&entity=${entity}` : `?property=${property}&value=${value}`;
    return new Promise<boolean>((resolve, reject) => {
      this.get(this.client, `${this.path}${query}`)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if ((res.success === true) && isDefined(body.data)) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => reject(err));
    });
  }
}

export class CustomValidators {
  static Match(control: string, otherControl: string) {
    return (controlGroup: AbstractControl) => {
      const firstControlValue = controlGroup.get(control).value === '' ? undefined : controlGroup.get(control).value;
      const otherControlValue = controlGroup.get(otherControl).value  === '' ? undefined : controlGroup.get(otherControl).value;
      console.log(firstControlValue, otherControlValue);
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
          return { minDate: true };
        }
      }
      return null;
    };
  }

  static maxDate(maxDate: string | Date): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.validator) {
        if (control.value && MomentUtils.isBefore(maxDate, control.value)) {
          return { maxDate: true };
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
        return { min: true };
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
        return { min: true };
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

  static uniqueValidator(service: UniqueValueService, controlName: string, entity: string = null) {
    return async (control: AbstractControl) => {
      return service.verify(controlName, control.value, entity).then(res => {
        return res ? null : { notUnique: true };
      });
    };
  }
}
