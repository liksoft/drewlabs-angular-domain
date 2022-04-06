import { ControlInterface } from '../compact/types';
import {
  InputInterface,
  InputValidationRule,
  RadioItem,
} from '../types';
import {
  buildRadioInputItems,
  buildRequiredIfConfig,
} from '../helpers/builders';

export interface RadioInput extends InputInterface {
  items: RadioItem[];
}

/**
 * Creates an instance of {@see RadioInput} interface
 *
 * @param source
 */
export function buildRadioInput(source: Partial<ControlInterface>) {
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
    // Date input parts
    items: buildRadioInputItems(source) ?? [],
  } as RadioInput;
}
