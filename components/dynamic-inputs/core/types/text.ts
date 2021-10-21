import { ControlInterface } from "../compact/types";
import {
  IHTMLFormControl,
  IHTMLFormControlValidationRule,
  InputTypes,
} from "../contracts";
import { buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

/**
 * @description Simple text control configurations definition
 */
export class TextInput extends AbstractHTMLFormControl {
  maxLength?: number;
  pattern?: string;
  minLength?: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: TextInput) {
    super(value);
    this.minLength = value.minLength || 1;
    this.maxLength = value.maxLength || undefined;
    this.pattern = value.pattern || undefined;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new TextInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? model.requiredIf
          ? buildRequiredIfConfig(model.requiredIf)
          : undefined
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        maxLength: model.maxLength ? true : false,
        minLength: model.minLength ? true : false,
        email: model.type === InputTypes.EMAIL_INPUT ? true : false,
        notUnique: Boolean(model.unique) ? true : false,
        pattern: model.pattern ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      pattern: model.pattern,
      minLength: model.minLength,
      maxLength: model.maxLength,
    } as TextInput);
  }
}
