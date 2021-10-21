import { ControlInterface } from "../compact/types";
import {
  CheckboxItem,
  IHTMLFormControl,
  IHTMLFormControlValidationRule,
} from "../contracts";
import { buildCheckboxItems, buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

export class CheckBoxInput extends AbstractHTMLFormControl {
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: CheckBoxInput) {
    super(value);
    // this.checked = value.checked ? value.checked : false;
    this.items = value.items ? value.items : [];
  }
  items: CheckboxItem[];

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new CheckBoxInput({
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
      // Date input parts
      items: buildCheckboxItems(model),
    } as CheckBoxInput);
  }
}
