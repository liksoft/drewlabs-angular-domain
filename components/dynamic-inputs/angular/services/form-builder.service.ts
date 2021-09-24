import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { isDefined } from "../../../../utils";
import { IDynamicForm, IHTMLFormControl } from "../../core/contracts";
import {
  ComponentReactiveFormHelpers,
} from "../helpers";

@Injectable({
  providedIn: "root",
})
export class DynamicFormBuilder {
  public constructor(private fb: FormBuilder) {}

  public readonly formBuilder = this.fb;

  /**
   * @description Provides a wrapper arround static method for parsing dynamic controls into an angular formgoup
   * @param inputs [[Array<IHTMLFormControl>]]
   * @param applyUniqueValidations [[boolean]]
   */
  public buildFormGroupFromInputConfig(inputs: IHTMLFormControl[]) {
    return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.fb,
      inputs
    );
  }

  /**
   * @description From the controls defined in a dynamic form, it controls, and inner embedded dynamic forms,
   * the method returns an Angular form [[FormGroup]] instance
   *
   * @param form
   * @param editing
   */
  buildFormGroupFromDynamicForm(form: IDynamicForm) {
    if (!isDefined(form)) {
      return null;
    }
    const configs = [...(form.controlConfigs as IHTMLFormControl[])];
    return this.buildFormGroupFromInputConfig(configs) as FormGroup;
  }
}
