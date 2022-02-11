import { ControlInterface } from "../compact/types";
import { IHTMLFormControl, IHTMLFormControlValidationRule } from "../contracts";
import { buildRequiredIfConfig } from "../helpers/builders";
import { AbstractHTMLFormControl } from "./dynamic-input";

export class FileInput extends AbstractHTMLFormControl {
  uploadUrl?: string;
  pattern?: string;
  multiple: boolean;
  maxFileSize: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: FileInput) {
    super(value);
    this.uploadUrl = value.uploadUrl || undefined;
    this.pattern = value.pattern || undefined;
    this.multiple = value.multiple || false;
    this.maxFileSize = value.maxFileSize || 10;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    return new FileInput({
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
      uploadUrl: model.uploadURL,
      pattern: model.pattern,
      multiple: Boolean(model.multiple),
      maxFileSize: model.max ? model.max : null,
    } as FileInput);
  }
}
