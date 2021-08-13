import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ICollection } from "../../../../contracts/collection-interface";
import { isDefined } from "../../../../utils";
import { UniqueValueService } from "../../../../validators";
import { IDynamicForm, IHTMLFormControl } from "../../core/contracts";
import { isGroupOfIDynamicForm } from "../../core/helpers";
import { ComponentReactiveFormHelpers, createAngularAbstractControl } from "../helpers";

@Injectable({
  providedIn: "root",
})
export class DynamicFormBuilder {

  public constructor(
    private uniqueValidator: UniqueValueService,
    private fb: FormBuilder
  ) {}

  public readonly formBuilder = this.fb;

  /**
   * @description Provides a wrapper arround static method for parsing dynamic controls into an angular formgoup
   * @param inputs [[Array<IHTMLFormControl>]]
   * @param applyUniqueValidations [[boolean]]
   */
  public buildFormGroupFromInputConfig(
    inputs: IHTMLFormControl[],
    applyUniqueValidations: boolean = true
    // applyRequiredRules: boolean = true
  ) {
    return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.fb,
      inputs,
      applyUniqueValidations ? this.uniqueValidator : undefined
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
    if (!isDefined(form)) {
      return null;
    }
    const c = [...(form.controlConfigs as Array<IHTMLFormControl>)];
    if (isGroupOfIDynamicForm(form)) {
      (form as IDynamicForm).forms?.forEach((v) => {
        c.push(
          ...(v.controlConfigs
            ? (v.controlConfigs as Array<IHTMLFormControl>)
            : [])
        );
      });
    }
    return this.buildFormGroupFromInputConfig(
      c,
      applyUniqueValidations
    ) as FormGroup;
  }

  /**
   * @description Build a formgroup from a collection of dynamic inputs
   * @param collection [[ICollection<IDynamicForm>]]
   * @param applyUniqueValidations [[boolean|null]]
   */
  formGroupFromCollectionOfDynamicControls(
    collection: ICollection<IDynamicForm>,
    applyUniqueValidations?: boolean
  ) {
    const group = this.fb.group({});
    collection.keys().forEach((k) => {
      const control = createAngularAbstractControl(
        this.fb,
        collection.get(k),
        applyUniqueValidations ? this.uniqueValidator : undefined
      );
      if (control) {
        group.addControl(k, control);
      }
    });
    return group;
  }
}
