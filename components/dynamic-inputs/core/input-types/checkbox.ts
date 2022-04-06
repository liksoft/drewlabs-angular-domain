import { ControlInterface } from '../compact/types';
import { CheckboxItem, InputInterface, InputValidationRule } from '../types';
import { buildCheckboxItems, buildRequiredIfConfig } from '../helpers/builders';

export interface CheckBoxInput extends InputInterface {
  items: CheckboxItem[];
}

export function buildCheckboxInput(source: Partial<ControlInterface>) {
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
    items: buildCheckboxItems(source) ?? [],
  } as CheckBoxInput;
}

// export class CheckBoxInput extends AbstractHTMLFormControl {
//   override items: CheckboxItem[] = [];
//   /**
//    * @description Instance initializer
//    * @param value Required input configuration object
//    */
//   constructor(value: CheckBoxInput) {
//     super(value);
//     // this.checked = value.checked ? value.checked : false;
//     this.items = value.items ? value.items : [];
//   }

//   /**
//    * Build a dynamic HTMLFormControl from a form control model
//    * @param model [[FormControlModel]]
//    */
//   static fromFormControlModel = (model: Partial<ControlInterface>) =>
//     new CheckBoxInput({
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
//       // Date input parts
//       items: buildCheckboxItems(model),
//     } as CheckBoxInput);
// }
