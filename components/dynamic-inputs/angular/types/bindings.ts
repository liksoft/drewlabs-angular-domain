import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { IDynamicForm, InputInterface, InputRequireIfConfig } from '../../core';

export interface BindingInterface {
  key: string;
  binding: InputRequireIfConfig | undefined;
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
  control: InputInterface;
}
