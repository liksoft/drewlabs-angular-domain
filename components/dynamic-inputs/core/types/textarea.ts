import { ControlInterface } from "../compact/types";
import { IHTMLFormControlValidationRule } from "../contracts/input-rules";
import { buildRequiredIfConfig } from "../helpers/builders";
import { TextInput } from "./text";

/**
 * @description Multi lines control configurations definition
 */
export class TextAreaInput extends TextInput {
  cols: number;
  rows: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: TextAreaInput) {
    super(value);
    this.cols = value.cols;
    this.rows = value.rows;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel = (model: Partial<ControlInterface>) =>
    new TextAreaInput({
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
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled),
      readOnly: Boolean(model.readonly),
      descriptionText: model.description,
      rows: model.rows,
      cols: model.columns,
    } as TextAreaInput);
}
