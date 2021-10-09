import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, FormArray } from "@angular/forms";
import { collect } from "../collections/collection";
import { FileFormControl } from "../components/dynamic-inputs/angular/types";
import { ICollection } from "../collections";

@Injectable({
  providedIn: "root",
})
export class TypeUtilHelper {
  /**
   * @description Checks if the value of the parameter is defined or not
   * @param value [[any]]
   */
  isDefined(value: any): boolean {
    return typeof value !== "undefined" && value !== null;
  }
  /**
   * Return any value as collection of items
   * @param value [[any]]
   */
  asCollection<T extends any>(value: any): ICollection<T> {
    if (Array.isArray(value)) {
      return collect(value as T[]);
    }
    return value as ICollection<any>;
  }

  /**
   * @description Checks if a given value is an array
   * @param value [[any]]
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * @description Returns an abstract control as a formgroup
   * @param control [[AbstractControl]]
   */
  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  /**
   * @description Returns an abstract control as a form array
   * @param control [[AbstractControl]]
   */
  asFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  /**
   * @deprecated
   */
  transformIFileFormControl(value: FileFormControl): {
    content: string;
    extension?: string;
  } {
    return { ...{ content: value.dataURL, extension: value.extension } };
  }

  asServerFileRequesBody(value: FileFormControl): {
    content: string;
    extension?: string;
  } {
    return { ...{ content: value?.dataURL, extension: value?.extension } };
  }
}
