import { ControlInterface } from '../compact/types';
import { buildRequiredIfConfig } from '../helpers/builders';
import { InputInterface, InputValidationRule } from '../types';

/**
 * @description Type definition of a form file control
 */
export interface FileInput extends InputInterface {
  uploadUrl?: string;
  pattern?: string;
  multiple: boolean;
  maxFileSize: number;
}

/**
 * Creates an instance of {@see FileInput} interface
 *
 * @param source
 * @returns
 */
export function buildFileInput(source: Partial<ControlInterface>) {
  return {
    label: source.label,
    type: source.type,
    formControlName: source.controlName,
    value: source.value,
    classes: source.classes,
    uniqueCondition: source.uniqueOn,
    isRepeatable: Boolean(source.isRepeatable),
    containerClass: source.dynamicControlContainerClass,
    requiredIf: source.requiredIf
      ? buildRequiredIfConfig(source.requiredIf)
      : undefined,
    formControlIndex: source.controlIndex,
    formControlGroupKey: source.controlGroupKey,
    rules: {
      isRequired: Boolean(source.required),
    } as InputValidationRule,
    placeholder: source.placeholder,
    disabled: Boolean(source.disabled),
    readOnly: Boolean(source.readonly),
    descriptionText: source.description,
    uploadUrl: source.uploadURL,
    pattern: source.pattern,
    multiple: Boolean(source.multiple),
    maxFileSize: source.max ? source.max : null,
  } as FileInput;
}

// export class FileInput extends AbstractHTMLFormControl {
//   uploadUrl?: string;
//   pattern?: string;
//   multiple: boolean;
//   maxFileSize: number;

//   /**
//    * @description Instance initializer
//    * @param value Required input configuration object
//    */
//   constructor(value: FileInput) {
//     super(value);
//     this.uploadUrl = value.uploadUrl || undefined;
//     this.pattern = value.pattern || undefined;
//     this.multiple = value.multiple || false;
//     this.maxFileSize = value.maxFileSize || 10;
//   }

//   /**
//    * Build a dynamic HTMLFormControl from a form control model
//    * @param model [[FormControlModel]]
//    */
//   static fromFormControlModel = (model: Partial<ControlInterface>) =>
//     new FileInput({
//       label: model.label,
//       type: model.type,
//       formControlName: model.controlName,
//       value: model.value,
//       classes: model.classes,
//       uniqueCondition: model.uniqueOn,
//       isRepeatable: Boolean(model.isRepeatable),
//       containerClass: model.dynamicControlContainerClass,
//       requiredIf: model.requiredIf
//         ? buildRequiredIfConfig(model.requiredIf)
//         : undefined,
//       formControlIndex: model.controlIndex,
//       formControlGroupKey: model.controlGroupKey,
//       rules: {
//         isRequired: Boolean(model.required),
//       } as InputValidationRule,
//       placeholder: model.placeholder,
//       disabled: Boolean(model.disabled),
//       readOnly: Boolean(model.readonly),
//       descriptionText: model.description,
//       uploadUrl: model.uploadURL,
//       pattern: model.pattern,
//       multiple: Boolean(model.multiple),
//       maxFileSize: model.max ? model.max : null,
//     } as FileInput);
// }
