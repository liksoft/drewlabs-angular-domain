import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { IDynamicForm } from '../../core/contracts/dynamic-form';
import { isDefined, isArray } from '../../../../utils';
import { createDynamicForm } from '../../core/helpers';
import { IConditionalControlBinding, MultiSelectItemRemoveEvent } from './types';
import { applyHiddenAttributeToControlFn, applyHiddenAttributeChangeToControl, bindingsFromDynamicForm } from './helpers';
import { createStateful } from '../../../../rxjs/helpers/creator-functions';
import { isGroupOfIDynamicForm } from '../../../../helpers/component-reactive-form-helpers';


@Component({
  selector: 'app-dynamic-form-wapper',
  templateUrl: './dynamic-form-wapper.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormWapperComponent {

  // tslint:disable-next-line: variable-name
  private _form: IDynamicForm;
  @Input() set form(value: IDynamicForm) {
    this.setComponentForm(value);
  }
  get form(): IDynamicForm {
    return this._form;
  }
  private _componentFormGroup: FormGroup;
  @Input() set componentFormGroup(value: FormGroup) {
    this._componentFormGroup = value;
  }
  get componentFormGroup(): FormGroup {
    return this._componentFormGroup;
  }
  @Output() controlItemRemoved = new EventEmitter<MultiSelectItemRemoveEvent>();
  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();

  // Text/Type input event
  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  @Input() singleColumnControl = false;
  @Input() controlContainerClass = 'clr-col-12';

  private _bindings$ = createStateful<{ [index: string]: IConditionalControlBinding }>({});
  get bindings$() {
    return this._bindings$.asObservable();
  }

  // tslint:disable-next-line: typedef
  setComponentForm(value: IDynamicForm) {
    this._form = createDynamicForm(value);
    let cache = this._bindings$.getValue();
    if (isGroupOfIDynamicForm(this._form)) {
      this._form.forms = this._form.forms.map((v) => {
        const { bindings, form, formgroup } = bindingsFromDynamicForm(v)(this._componentFormGroup);
        this._componentFormGroup = formgroup as FormGroup;
        cache = { ...(cache || {}), ...bindings }
        return form;
      });
    } else {
      const { bindings, form, formgroup } = bindingsFromDynamicForm(this._form)(this._componentFormGroup);
      this._componentFormGroup = formgroup as FormGroup;
      this._form = form;
      cache = { ...(cache || {}), ...bindings }
    }
    this._bindings$.next(cache);
  }

  // tslint:disable-next-line: typedef
  shouldListenforChange(controlName: string, bindings: { [prop: string]: IConditionalControlBinding }) {
    return isDefined(
      Object.values(bindings).find((o, i) => {
        return o.binding.formControlName === controlName;
      })
    ) ? true : false;
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(event: any, bindings: { [prop: string]: IConditionalControlBinding }) {
    const filteredConfigs = Object.values(bindings).filter((o) => {
      return o.binding.formControlName.toString() === event.controlName.toString();
    });
    if (isArray(filteredConfigs)) {
      filteredConfigs.forEach((item) => {
        const { control, dynamicForm } = applyHiddenAttributeChangeToControl(
          this._form,
          item,
          event.event,
          applyHiddenAttributeToControlFn
        )(this._componentFormGroup);
        this._componentFormGroup = control as FormGroup;
        this._form = dynamicForm;
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
  isFormGroup(f: IDynamicForm) {
    return isGroupOfIDynamicForm(f);
  }

  asFormArray(control: AbstractControl, index: number): FormArray {
    return control as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
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
