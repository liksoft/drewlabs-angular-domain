import { ControlInterface } from "../compact/types";
import { IHTMLFormControl, IHTMLFormControlValidationRule } from "../contracts";
import { buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

/**
 * @description Number type Form Control configuration definition class
 */
export class NumberInput extends AbstractHTMLFormControl {
  min: number;
  max?: number;
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: NumberInput) {
    super(value);
    this.min = value.min;
    this.max = value.max;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new NumberInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable),
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required),
        max: Boolean(model.max),
        min: Boolean(model.min),
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled),
      readOnly: Boolean(model.readonly),
      descriptionText: model.description,
      min: model.min,
      max: model.max,
    } as NumberInput);
  }
}
