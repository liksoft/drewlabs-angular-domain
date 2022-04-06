import { ControlInterface } from '../compact/types';
import { InputInterface } from '../types';

export interface HTMLInput extends InputInterface {}

/**
 * Build an instance of the {@see HTMLInput} interface
 *
 * @param source
 * @returns
 */
export function buildHTMLInput(source: Partial<ControlInterface>) {
  return {
    label: source.label,
    type: source.type,
    formControlName: source.controlName,
    value: source.value,
    classes: source.classes,
    isRepeatable: Boolean(source.isRepeatable),
    containerClass: source.dynamicControlContainerClass,
    formControlIndex: source.controlIndex,
    formControlGroupKey: source.controlGroupKey,
    descriptionText: source.description,
  } as HTMLInput;
}