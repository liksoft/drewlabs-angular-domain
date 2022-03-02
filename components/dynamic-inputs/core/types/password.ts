import { ControlInterface } from "../compact/types";
import { IHTMLFormControlValidationRule } from "../contracts/input-rules";
import { buildRequiredIfConfig } from "../helpers/builders";
import { TextInput } from "./text";

/**
 * @description Password control configuration definition class
 */
export class PasswordInput extends TextInput {
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: PasswordInput) {
    super(value);
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel = (model: Partial<ControlInterface>) =>
    new PasswordInput({
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
        maxLength: Boolean(model.maxLength),
        minLength: Boolean(model.minLength),
        pattern: Boolean(model.pattern),
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled),
      readOnly: Boolean(model.readonly),
      descriptionText: model.description,
      pattern: model.pattern,
      minLength: model.minLength,
      maxLength: model.maxLength,
    } as PasswordInput);
}
