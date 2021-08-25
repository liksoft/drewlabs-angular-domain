import { IHTMLFormControlValidationRule } from "./contracts/input-rules";
import { isDefined } from "../../../utils/types/type-utils";
import { InputTypes } from "./contracts/input-types";
import {
  buildRequiredIfConfig,
  buildCheckboxItems,
  buildRadioInputItems,
  parseControlItemsConfigs,
  controlBindingsSetter,
} from "./helpers";
import { CheckboxItem, ISelectItem, RadioItem } from "./contracts/control-item";
import { AbstractHTMLFormControl } from "./dynamic-input";
import {
  BindingControlInterface,
  IHTMLFormControl,
} from "./contracts/dynamic-input";
import { DynamicFormControlInterface } from "./compact/types";

export function toDynamicControl(
  model: Partial<DynamicFormControlInterface>
): IHTMLFormControl {
  switch (model.type) {
    case InputTypes.DATE_INPUT:
      return DateInput.fromFormControlModel(model);
    case InputTypes.SELECT_INPUT:
      return SelectInput.fromFormControlModel(model);
    case InputTypes.TEXTAREA_INPUT:
      return TextAreaInput.fromFormControlModel(model);
    case InputTypes.NUMBER_INPUT:
      return NumberInput.fromFormControlModel(model);
    case InputTypes.PHONE_INPUT:
      return PhoneInput.fromFormControlModel(model);
    case InputTypes.PASSWORD_INPUT:
      return PasswordInput.fromFormControlModel(model);
    case InputTypes.CHECKBOX_INPUT:
      return CheckBoxInput.fromFormControlModel(model);
    case InputTypes.RADIO_INPUT:
      return RadioInput.fromFormControlModel(model);
    case InputTypes.EMAIL_INPUT:
      return TextInput.fromFormControlModel(model);
    case InputTypes.HIDDEN_INPUT:
      return HiddenInput.fromFormControlModel(model);
    case InputTypes.FILE_INPUT:
      return FileInput.fromFormControlModel(model);
    case InputTypes.HTML_INPUT:
      return HMTLInput.fromFormControlModel(model);
    default:
      return TextInput.fromFormControlModel(model);
  }
}

/**
 * @description Simple text control configurations definition
 */
export class TextInput extends AbstractHTMLFormControl {
  maxLength?: number;
  pattern?: string;
  minLength?: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: TextInput) {
    super(value);
    this.minLength = value.minLength || 1;
    this.maxLength = value.maxLength || undefined;
    this.pattern = value.pattern || undefined;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new TextInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? model.requiredIf
          ? buildRequiredIfConfig(model.requiredIf)
          : undefined
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        maxLength: model.maxLength ? true : false,
        minLength: model.minLength ? true : false,
        email: model.type === InputTypes.EMAIL_INPUT ? true : false,
        notUnique: Boolean(model.unique) ? true : false,
        pattern: isDefined(model.pattern) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      pattern: model.pattern,
      minLength: model.minLength,
      maxLength: model.maxLength,
    } as TextInput);
  }
}

export class DateInput extends AbstractHTMLFormControl {
  minDate: Date | string;
  maxDate: Date | string;
  currentDate: Date | string;
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
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new DateInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        maxDate: isDefined(model.maxDate) ? true : false,
        minDate: isDefined(model.minDate) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      // Date input parts
      minDate: model.minDate,
      maxDate: model.maxDate,
      currentDate: "",
      dateInputFormat: "dd/mm/yyyy",
    } as DateInput);
  }
}

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
  items: Array<CheckboxItem>;

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new CheckBoxInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      // Date input parts
      items: buildCheckboxItems(model),
    } as CheckBoxInput);
  }
}

/**
 * @description Hidden type Form Control configuration definition class
 */
export class HiddenInput extends AbstractHTMLFormControl {
  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new HiddenInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
    } as DateInput);
  }
}

/**
 * @description Number type Form Control configuration definition class
 */
export class NumberInput extends AbstractHTMLFormControl {
  min: number;
  max?: number;
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: NumberInput) {
    super(value);
    this.min = value.min;
    this.max = value.max;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new NumberInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        max: isDefined(model.max) ? true : false,
        min: isDefined(model.min) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      min: model.min,
      max: model.max,
    } as NumberInput);
  }
}

/**
 * @description Password control configuration definition class
 */
export class PasswordInput extends TextInput {
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: PasswordInput) {
    super(value);
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new PasswordInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        maxLength: model.maxLength ? true : false,
        minLength: model.minLength ? true : false,
        pattern: isDefined(model.pattern) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      pattern: model.pattern,
      minLength: model.minLength,
      maxLength: model.maxLength,
    } as PasswordInput);
  }
}

/**
 * @description Phone numbers control configuration definition class
 */
export class PhoneInput extends TextInput {
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: PhoneInput) {
    super(value);
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new PhoneInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
        maxLength: model.maxLength ? true : false,
        minLength: model.minLength ? true : false,
        notUnique: Boolean(model.unique) ? true : false,
        pattern: isDefined(model.pattern) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      pattern: model.pattern,
      minLength: model.minLength,
      maxLength: model.maxLength,
    } as PhoneInput);
  }
}

/**
 * @description Radio button control configuration definition class
 */
export class RadioInput extends AbstractHTMLFormControl {
  items: Array<RadioItem>;
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
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new RadioInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      // Date input parts
      items: buildRadioInputItems(model),
    } as RadioInput);
  }
}

/**
 * @description Selectable options control configuration definition class
 */
export class SelectInput
  extends AbstractHTMLFormControl
  implements Partial<BindingControlInterface>
{
  items: Array<any>;
  optionsLabel?: string;
  optionsValueIndex?: string | number;
  multiple?: boolean;
  groupByKey?: string;

  // Added properties for loading data remotely
  serverBindings?: string;
  clientBindings?: string;
  groupfield: string;
  valuefield: string;
  keyfield: string;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: Partial<SelectInput>) {
    super(value);
    this.items = value.items || [];
    this.optionsLabel = value.optionsLabel;
    this.optionsValueIndex = value.optionsValueIndex;
    this.multiple = value.multiple ? value.multiple : false;
    this.groupByKey = value.groupByKey;
    this.serverBindings = value.serverBindings;
    this.clientBindings = value.clientBindings;
    this.groupfield = value.groupfield || "id";
    this.valuefield = value.valuefield || "label";
    this.keyfield = value.keyfield || "id";
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    // Parse the model fields
    let { keyfield, valuefield, groupfield } = model.selectableModel
      ? parseControlItemsConfigs(model)
      : model;
    keyfield = model.keyfield || keyfield;
    valuefield = model.valuefield || valuefield;
    groupfield = model.groupfield || groupfield;
    // ! End Parse model fields
    return new SelectInput(
      controlBindingsSetter<SelectInput>(model.options || [])({
        ...{ keyfield, valuefield, groupfield },
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        uniqueCondition: model.uniqueOn,
        isRepeatable: Boolean(model.isRepeatable) ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: model.requiredIf
          ? buildRequiredIfConfig(model.requiredIf)
          : undefined,
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: Boolean(model.required) ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: Boolean(model.disabled) ? true : false,
        readOnly: Boolean(model.readonly) ? true : false,
        descriptionText: model.description,
        optionsLabel: "description",
        groupByKey: "type",
        optionsValueIndex: "id",
        multiple: Boolean(model.multiple) ? true : false,
        serverBindings: model.selectableModel,
        clientBindings: model.selectableValues,
      } as SelectInput)
    );
  }
}

/**
 * @description Multi lines control configurations definition
 */
export class TextAreaInput extends TextInput {
  cols: number;
  rows: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: TextAreaInput) {
    super(value);
    this.cols = value.cols;
    this.rows = value.rows;
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new TextAreaInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      rows: model.rows,
      cols: model.columns,
    } as TextAreaInput);
  }
}

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
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new FileInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      uploadUrl: model.uploadURL,
      pattern: model.pattern,
      multiple: Boolean(model.multiple) ? true : false,
      maxFileSize: model.max ? model.max : null,
    } as FileInput);
  }
}

export class HMTLInput extends AbstractHTMLFormControl {
  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: HMTLInput) {
    super(value);
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new HMTLInput({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
    } as HMTLInput);
  }
}

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
  static fromFormControlModel(
    model: Partial<DynamicFormControlInterface>
  ): IHTMLFormControl {
    return new InputGroup({
      label: model.label,
      type: model.type,
      formControlName: model.controlName,
      value: model.value,
      classes: model.classes,
      uniqueCondition: model.uniqueOn,
      isRepeatable: Boolean(model.isRepeatable) ? true : false,
      containerClass: model.dynamicControlContainerClass,
      requiredIf: model.requiredIf
        ? buildRequiredIfConfig(model.requiredIf)
        : undefined,
      formControlIndex: model.controlIndex,
      formControlGroupKey: model.controlGroupKey,
      rules: {
        isRequired: Boolean(model.required) ? true : false,
      } as IHTMLFormControlValidationRule,
      placeholder: model.placeholder,
      disabled: Boolean(model.disabled) ? true : false,
      readOnly: Boolean(model.readonly) ? true : false,
      descriptionText: model.description,
      children: model.children?.map((v) => toDynamicControl(v)),
    } as InputGroup);
  }
}
export { CheckboxItem, ISelectItem, RadioItem };
