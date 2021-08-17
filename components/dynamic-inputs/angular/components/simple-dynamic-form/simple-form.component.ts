import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { createSubject } from "src/app/lib/core/rxjs/helpers";
import { IDynamicForm } from "../../../core/contracts";
import { ComponentReactiveFormHelpers } from "../../helpers";
import { DynamicFormBuilder } from "../../services/form-builder.service";

@Component({
  selector: "app-simple-dynamic-form",
  templateUrl: "./simple-form.component.html",
  styles: [],
})
export class SimpleDynamicFormComponent implements OnDestroy {

  _formgroup!: FormGroup;
  _form!: IDynamicForm;

  @Input() performingAction = false;
  @Input() buttonDisabled = false;

  @Input() set form(value: IDynamicForm) {
    this._form = value;
    if (value) {
      this._formgroup = this._parser.buildFormGroupFromDynamicForm(
        value
      ) as FormGroup;
      this.componentReadyStateChanges.emit();
    }
  }
  get form() {
    return this._form;
  }
  get formgroup() {
    return this._formgroup;
  }

  @Output() public formEvent = new EventEmitter<{ [index: string]: any }>();
  @Output() public componentReadyStateChanges = new EventEmitter();

  public readonly destroy$ = createSubject();

  public constructor(private _parser: DynamicFormBuilder) {}

  listenFormControlChanges = (control: string) =>
    this._formgroup?.get(control)?.valueChanges;

  getControlValue = (control: string, _default?: any) => {
    const value = this._formgroup.get(control)?.value;
    return value || _default || undefined;
  };

  setControlValue = (control: string, value: any) =>
    (() => {
      this._formgroup.get(control)?.setValue(value);
    })();

  addControl = (name: string, control: AbstractControl) =>
    (() => {
      if (this._formgroup.get(name)) {
        return this._formgroup.get(name)?.setValue(control.value);
      }
      this._formgroup.addControl(name, control);
    })();

  getControl = (name: string) =>
    (() => {
      return this.formgroup.get(name);
    })();

  onFormSubmitted = (event: Event) =>
    (() => {
      ComponentReactiveFormHelpers.validateFormGroupFields(this._formgroup);
      if (this._formgroup.valid) {
        // TODO : Send Verification request to the client phone number
        this.formEvent.emit(this._formgroup.getRawValue());
      }
      event.preventDefault();
    })();

  public setComponentForm = (value: IDynamicForm) =>
    (() => {
      this._form = value;
      if (value) {
        this._formgroup = this._parser.buildFormGroupFromDynamicForm(
          value
        ) as FormGroup;
      }
    })();

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
