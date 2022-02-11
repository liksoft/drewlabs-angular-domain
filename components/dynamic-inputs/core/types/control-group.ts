import { ControlInterface } from "../compact/types";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { IHTMLFormControlValidationRule } from "../contracts/input-rules";
import { buildRequiredIfConfig } from "../helpers/builders";
import { buildControl } from "./builder";
import { AbstractHTMLFormControl } from "./dynamic-input";

export class InputGroup extends AbstractHTMLFormControl {
  children: IHTMLFormControl[];
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: InputGroup) {
    super(value);
    this.children = value.children || [];
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel = (model: Partial<ControlInterface>) =>
    new InputGroup({
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
      children: model.children?.map((v) => buildControl(v)),
    } as InputGroup);
}
