import { ControlInterface } from "../compact/types";
import { IHTMLFormControl, IHTMLFormControlValidationRule } from "../contracts";
import { buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

/**
 * @description Hidden type Form Control configuration definition class
 */
export class HiddenInput extends AbstractHTMLFormControl {
  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new HiddenInput({
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required),
      } as IHTMLFormControlValidationRule,
      disabled: true,
      readOnly: true,
    } as HiddenInput);
  }
}
