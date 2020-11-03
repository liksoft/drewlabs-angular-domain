import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { IDynamicForm } from '../../core/contracts/dynamic-form';
import { isDefined, isArray } from '../../../../utils';
import { HTMLFormControlRequireIfConfig, IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { isGroupOfIDynamicForm, ComponentReactiveFormHelpers } from 'src/app/lib/domain/helpers/component-reactive-form-helpers';
import { sortFormByIndex } from '../../core/helpers';
import * as lodash from 'lodash';

interface IConditionalControlBinding {
  key: string;
  binding: HTMLFormControlRequireIfConfig;
  validators: ValidatorFn | ValidatorFn[];
  asyncValidators: AsyncValidatorFn | AsyncValidatorFn[];
}

export interface MultiSelectItemRemoveEvent {
  event: any;
  control: IHTMLFormControl;
}

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
  @Input() componentFormGroup: FormGroup;
  @Output() controlItemRemoved = new EventEmitter<MultiSelectItemRemoveEvent>();
  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  public conditionalControlBindings: { [index: string]: IConditionalControlBinding } = {};

  // Text/Type input event
  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  public isValueDefined: (value: any) => boolean = isDefined.bind(this);

  @Input() singleColumnControl = false;
  @Input() controlContainerClass = 'clr-col-12';

  // tslint:disable-next-line: typedef
  setComponentForm(value: IDynamicForm) {
    this._form = sortFormByIndex(value);
    if (this.isFormGroup(this.form)) {
      this.form.forms.forEach((v) => {
        this.buildConditionalControlBindings(v);
      });
    } else {
      this.buildConditionalControlBindings(this.form);
    }
  }

  // tslint:disable-next-line: typedef
  buildConditionalControlBindings(v: IDynamicForm) {
    if (isDefined(v.controlConfigs) && ((v.controlConfigs as Array<IHTMLFormControl>).length > 0)) {
      (v.controlConfigs as Array<IHTMLFormControl>).forEach((c) => {
        if (isDefined(c.requiredIf)) {
          this.conditionalControlBindings[c.formControlName] = {
            key: c.formControlName,
            binding: c.requiredIf,
            validators: this.componentFormGroup.get(c.formControlName).validator,
            asyncValidators: this.componentFormGroup.get(c.formControlName).asyncValidator,
          };
        }
      });
      for (const [k, value] of Object.entries(this.conditionalControlBindings)) {
        if (isDefined(this.componentFormGroup.get(value.binding.formControlName))) {
          this.applyHiddenOnMatchingControls(value,
            this.componentFormGroup.get(value.binding.formControlName).value,
            this.updateControlHiddenValue.bind(this));
        }
      }
    }
  }

  // tslint:disable-next-line: typedef
  shouldListenforChange(controlName: string) {
    if (isDefined(
      Object.values(this.conditionalControlBindings).find((o, i) => {
        return o.binding.formControlName === controlName;
      })
    )) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(event: any) {
    const filteredConfigs = Object.values(this.conditionalControlBindings).filter((o) => {
      return o.binding.formControlName.toString() === event.controlName.toString();
    });
    if (isArray(filteredConfigs)) {
      filteredConfigs.forEach((item) => {
        this.applyHiddenOnMatchingControls(item, event.event, this.updateControlHiddenValue.bind(this));
      });
    }
  }

  // tslint:disable-next-line: typedef
  applyHiddenOnMatchingControls(
    bindings: IConditionalControlBinding,
    value: string | number,
    fn: (f: IDynamicForm, c: IConditionalControlBinding, s: string | number) => void) {
    if (this.isFormGroup(this.form)) {
      this.form.forms.forEach((v) => {
        // Call the update method here
        fn(v, bindings, value);
      });
    } else {
      // Calls the update method here
      fn(this.form, bindings, value);
    }
  }

  // tslint:disable-next-line: typedef
  updateControlHiddenValue(v: IDynamicForm, conditionBindings: IConditionalControlBinding, value: string | number) {
    if (this.isValueDefined(v.controlConfigs) && ((v.controlConfigs as Array<IHTMLFormControl>).length > 0)) {
      (v.controlConfigs as Array<IHTMLFormControl>).forEach((c) => {
        if (c.formControlName === conditionBindings.key) {
          value = isNaN(value as any) ? value : lodash.toNumber(value);
          const requiredIfValues = lodash.isNumber(value) ? c.requiredIf.values.map(item => {
            return isNaN(item) ? item : lodash.toNumber(item);
          }) : c.requiredIf.values;
          c.hidden = !lodash.includes(requiredIfValues, value) ? true : false;
          if (c.hidden) {
            this.componentFormGroup.get(conditionBindings.key).setValue(null);
            ComponentReactiveFormHelpers.clearControlValidators(this.componentFormGroup.get(conditionBindings.key));
            ComponentReactiveFormHelpers.clearAsyncValidators(this.componentFormGroup.get(conditionBindings.key));
          } else {
            this.componentFormGroup.get(conditionBindings.key).setValidators(conditionBindings.validators);
            this.componentFormGroup.get(conditionBindings.key).setAsyncValidators(conditionBindings.asyncValidators);
          }
          return;
        }
      });
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
