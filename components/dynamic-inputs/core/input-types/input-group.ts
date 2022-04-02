import { ControlGroupInterface } from "../compact";
import { IHTMLFormControl } from "../contracts";
import { buildControl, buildRequiredIfConfig } from "../helpers";

export interface InputGroup extends IHTMLFormControl {
  children: IHTMLFormControl[];
}

/**
 * Create an {@see InputGroup} type from API data structure
 *
 * This function serves as bridge for transforming server structured
 * control interface into client supported interface
 *
 * ```js
 * const inputGroup = createInputGroup({
 *  // Type definition of the input group
 * }); // Instance of InputGroup
 * ```
 *
 * @param source
 * @returns
 */
export function createInputGroup(source: ControlGroupInterface) {
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
      maxLength: Boolean(source.maxLength),
      minLength: Boolean(source.minLength),
      pattern: Boolean(source.pattern),
    },
    placeholder: source.placeholder,
    disabled: Boolean(source.disabled),
    readOnly: Boolean(source.readonly),
    descriptionText: source.description,
    pattern: source.pattern,
    minLength: source.minLength,
    maxLength: source.maxLength,
    children: source.children.map((current) => buildControl(current)),
  } as InputGroup;
}
