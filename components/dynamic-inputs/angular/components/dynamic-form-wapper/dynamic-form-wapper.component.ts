import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { isDefined, isArray } from "../../../../../utils";
import { createform, sortformbyindex } from "../../../core/helpers";
import { createStateful } from "../../../../../rxjs/helpers/creator-functions";
import { IDynamicForm } from "../../../core/contracts";
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

@Component({
  selector: "app-dynamic-form-wapper",
  templateUrl: "./dynamic-form-wapper.component.html",
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormWapperComponent {
  @Input() _componentForm!: IDynamicForm;
  get componentForm() {
    return this._componentForm;
  }

  // tslint:disable-next-line: variable-name
  @Input() set form(value: any) {
    this._componentForm = this.setComponentForm(value);
  }
  @Input() componentFormGroup!: FormGroup;
  @Output() controlItemRemoved = new EventEmitter<MultiSelectItemRemoveEvent>();
  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();

  // Text/Type input event
  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  @Input() singleColumnControl = false;
  @Input() controlContainerClass = "clr-col-12";

  private _bindings$ = createStateful<ControlBindings>({});
  get bindings$() {
    return this._bindings$.asObservable();
  }

  // tslint:disable-next-line: typedef
  setComponentForm(value: IDynamicForm) {
    let _form = sortformbyindex(createform(value));
    // let _form = value;
    let cache = this._bindings$.getValue();
    const { bindings, form, formgroup } = getControlBinding(_form)(
      this.componentFormGroup
    );
    this.componentFormGroup = formgroup as FormGroup;
    _form = form;
    cache = { ...(cache || {}), ...bindings };
    this._bindings$.next(cache);
    return _form;
  }

  // tslint:disable-next-line: typedef
  shouldListenforChange(controlName: string, bindings: ControlBindings) {
    return isDefined(
      Object.values(bindings).find((o, i) => {
        return o.binding?.formControlName === controlName;
      })
    )
      ? true
      : false;
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(event: any, name: string, bindings: ControlBindings) {
    const filteredConfigs = Object.values(bindings).filter((o) => {
      return o.binding?.formControlName.toString() === name.toString();
    });
    if (isArray(filteredConfigs)) {
      filteredConfigs.forEach((item) => {
        const { control, dynamicForm } = applyAttribute(
          this._componentForm,
          item,
          event,
          applyHiddenAttributeCallback
        )(this.componentFormGroup);
        this.componentFormGroup = control as FormGroup;
        this._componentForm = dynamicForm;
      }); //
    }
  }

  getControlContainerClass(clazz: string): string {
    if (this.singleColumnControl) {
      return this.controlContainerClass;
    }
    return isDefined(clazz) ? clazz : this.controlContainerClass;
  }

  // tslint:disable-next-line: typedef
  asArray(value: any) {
    return value as Array<any>;
  }

  rebuilListItems(values: any[]): any[] {
    if (isDefined(values)) {
      return [...values];
    }
    return values;
  }
}
