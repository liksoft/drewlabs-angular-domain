import { AbstractControl, AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { IDynamicForm } from "../../core/contracts/dynamic-form";
import {
  HTMLFormControlRequireIfConfig,
  IHTMLFormControl,
} from "../../core/contracts/dynamic-input";

export interface BindingInterface {
  key: string;
  binding: HTMLFormControlRequireIfConfig | undefined;
  validators: ValidatorFn | ValidatorFn[] | undefined;
  asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | undefined;
}

export type ControlBindings = { [prop: string]: BindingInterface };

export type ApplyAttributeChangesResult = {
  control: AbstractControl;
  form: IDynamicForm;
};

export type ApplyAttributeChangesToControlsCallback = (
  form: IDynamicForm,
  binding: BindingInterface,
  index: string | number
) => (formgroup: AbstractControl) => ApplyAttributeChangesResult;

export interface MultiSelectItemRemoveEvent {
  event: any;
  control: IHTMLFormControl;
}
