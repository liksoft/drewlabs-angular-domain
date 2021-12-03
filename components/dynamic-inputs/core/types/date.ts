import { ControlInterface } from "../compact/types";
import { IHTMLFormControl, IHTMLFormControlValidationRule } from "../contracts";
import { buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

export class DateInput extends AbstractHTMLFormControl {
  minDate: string;
  maxDate: string;
  currentDate: string;
  dateInputFormat?: string;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: DateInput) {
    super(value);
    this.minDate = value.minDate;
    this.maxDate = value.maxDate;
    this.currentDate = value.currentDate;
    this.dateInputFormat = value.dateInputFormat || "dd/mm/yyyy";
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new DateInput({
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
        maxDate: Boolean(model.maxDate),
        minDate: Boolean(model.minDate),
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled),
      readOnly: Boolean(model.readonly),
      descriptionText: model.description,
      // Date input parts
      minDate: model.minDate,
      maxDate: model.maxDate,
      currentDate: "",
      dateInputFormat: "dd/mm/yyyy",
    } as DateInput);
  }
}
