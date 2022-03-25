import { AbstractControl, FormBuilder } from "@angular/forms";
import { IDynamicForm, IHTMLFormControl } from "../../core";

export type Builder = FormBuilder;

export interface AngularReactiveFormBuilderBridge {
  /**
   * @var
   */
  readonly builder: Builder;

  /**
   * @description Create an angular reactive form element from the configuration
   * from dynamic form or list of dynamic inputs
   * @param source
   */
  group(source: IDynamicForm | IHTMLFormControl[]): AbstractControl;
}
