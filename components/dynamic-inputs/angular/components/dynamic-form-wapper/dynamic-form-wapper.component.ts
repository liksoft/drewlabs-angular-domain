import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { createform, sortformbyindex } from "../../../core/helpers";
import { createStateful } from "../../../../../rxjs/helpers/creator-functions";
import { IDynamicForm, IHTMLFormControl } from "../../../core/contracts";
import {
  ControlBindings,
  InputEventArgs,
  MultiSelectItemRemoveEvent,
} from "../../types";
import {
  applyAttribute,
  applyHiddenAttributeCallback,
  getControlBinding,
} from "../../helpers";
import { isEmpty } from "lodash";

type UndefinedDynamicForm = IDynamicForm | undefined;
type UndefinedFormGroup = AbstractControl | undefined;

@Component({
  selector: "app-dynamic-form-wapper",
  templateUrl: "./dynamic-form-wapper.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormWapperComponent {
  @Input() _form!: IDynamicForm;
  get form() {
    return this._form;
  }

  // tslint:disable-next-line: variable-name
  @Input() set form(value: any) {
    const { form, formgroup } = this.setComponentForm(value, this._formgroup);
    this._form = form as IDynamicForm;
    this._formgroup = formgroup as FormGroup;
  }
  _formgroup!: FormGroup;
  @Input("componentFormGroup")
  set formgroup(value: FormGroup) {
    const { form, formgroup } = this.setComponentForm(this._form, value);
    this._form = form as IDynamicForm;
    this._formgroup = formgroup as FormGroup;
  }
  get formgroup() {
    return this._formgroup;
  }
  @Output("controlItemRemoved")
  itemRemoved = new EventEmitter<MultiSelectItemRemoveEvent>();
  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();

  // Text/Type input event
  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  @Input("singleColumnControl")
  singleColumn = false;
  @Input("controlContainerClass")
  containerClass = "clr-col-12";

  private _bindings$ = createStateful<ControlBindings>({} as ControlBindings);
  get bindings$() {
    return this._bindings$.asObservable();
  }

  // tslint:disable-next-line: typedef
  setComponentForm(value: UndefinedDynamicForm, control?: UndefinedFormGroup) {
    const bindings_ = this._bindings$.getValue();
    if (value && control && isEmpty(bindings_)) {
      let _form = sortformbyindex(createform(value));
      const { bindings, form, formgroup } = getControlBinding(_form)(
        control as AbstractControl
      );
      this._bindings$.next({ ...bindings_, ...bindings });
      return { form, formgroup };
    } else {
      return { form: value, formgroup: control };
    }
  }

  // tslint:disable-next-line: typedef
  shouldListenforChange(controlName: string, bindings: ControlBindings) {
    const control_ = Object.values(bindings).find((control) => {
      return control.binding?.formControlName === controlName;
    });
    return control_ ? true : false;
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(event: any, name: string, bindings: ControlBindings) {
    const configs = Object.values(bindings).filter(
      (controlBinding) =>
        controlBinding.binding?.formControlName.toString() === name.toString()
    );
    if (Array.isArray(configs)) {
      configs.forEach((item) => {
        const { control, dynamicForm } = applyAttribute(
          this._form,
          item,
          event,
          applyHiddenAttributeCallback
        )(this._formgroup);
        this._formgroup = control as FormGroup;
        this._form = dynamicForm;
      });
    }
  }

  getContainerClass(clazz: string): string {
    const clazz_ = this.singleColumn ? this.containerClass : clazz;
    return clazz_ ?? this.containerClass;
  }

  hasInputs(value: IDynamicForm) {
    return (
      value?.controlConfigs &&
      (value?.controlConfigs as IHTMLFormControl[]).length !== 0
    );
  }

  asFormControl(control: AbstractControl) {
    return control as FormControl;
  }
}
