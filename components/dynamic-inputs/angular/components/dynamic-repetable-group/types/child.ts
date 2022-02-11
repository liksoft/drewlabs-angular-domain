import { EventEmitter } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { IDynamicForm } from "../../../../core";

export interface ChildComponent {
  form: IDynamicForm;
  formGroup: AbstractControl;
  componentDestroyer: EventEmitter<any>;
  index: number;
  label: string;
  singleColumnView: boolean;
}
