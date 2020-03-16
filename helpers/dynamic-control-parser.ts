import { Injectable } from '@angular/core';
import { UniqueValueService } from '../utils/custom-validators';
import { IHTMLFormControl } from '../components/dynamic-inputs/core';
import { ComponentReactiveFormHelpers } from './component-reactive-form-helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeUtilHelper } from './type-utils-helper';
import { IDynamicForm } from '../components/dynamic-inputs/core/contracts/dynamic-form';

@Injectable({
  providedIn: 'root'
})
export class DynamicControlParser {

  public constructor(private uniqueFieldValidator: UniqueValueService, private fb: FormBuilder, private typeHelper: TypeUtilHelper) { }

  /**
   * @description Provides a wrapper arround static method for parsing dynamic controls into an angular formgoup
   * @param inputs [[Array<IHTMLFormControl>]]
   * @param applyUniqueValidations [[boolean]]
   */
  public buildFormGroupFromInputConfig(
    inputs: IHTMLFormControl[],
    applyUniqueValidations: boolean = true,
    // applyRequiredRules: boolean = true
  ) {
    return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.fb,
      inputs,
      applyUniqueValidations ? this.uniqueFieldValidator : null
    );
  }

  /**
   * @description From the controls defined in a dynamic form, it controls, and inner embedded dynamic forms,
   * the method returns an Angular form [[FormGroup]] instance
   * @param form [[IDynamicForm]]
   * @param applyUniqueValidations [[boolean]]
   */
  buildFormGroupFromDynamicForm(
    form: IDynamicForm,
    applyUniqueValidations: boolean = true
  ) {
    if (!this.typeHelper.isDefined(form)) {
      return null;
    }
    const c = [...form.controlConfigs as Array<IHTMLFormControl>];
    if (this.typeHelper.isFormGroup(form)) {
      (form as IDynamicForm).forms.forEach((v) => {
        c.push(...(v.controlConfigs ? v.controlConfigs as Array<IHTMLFormControl> : []));
      });
    }
    return this.buildFormGroupFromInputConfig(c, applyUniqueValidations) as FormGroup;
  }
}
