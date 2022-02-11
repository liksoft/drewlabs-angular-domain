import { ControlInterface } from "../compact/types";
import {
  IHTMLFormControl,
  IHTMLFormControlValidationRule,
  RadioItem,
} from "../contracts";
import {
  buildRadioInputItems,
  buildRequiredIfConfig,
} from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

/**
 * @description Radio button control configuration definition class
 */
export class RadioInput extends AbstractHTMLFormControl {
  items: RadioItem[];
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: IHTMLFormControl) {
    super(value);
    this.items = value.items ? value.items : [];
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new RadioInput({
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
      items: buildRadioInputItems(model),
    } as RadioInput);
  }
}
