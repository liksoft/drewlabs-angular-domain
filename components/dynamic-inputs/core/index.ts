import { AbstractHTMLFormControl } from './abstract-dynamic-input';
import { IHTMLFormControl } from './contracts/dynamic-input-interface';
import { FormControlModel } from './contracts/form-control';
import { IHTMLFormControlValidationRule } from './contracts/input-rules';
import { isDefined } from '../../../utils/type-utils';
import { InputTypes } from './input-types';

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
    this.minLength = value.minLength ? value.minLength : null;
    this.maxLength = value.maxLength ? value.maxLength : null;
    this.pattern = value.pattern ? value.pattern : null;
  }


  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new TextInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
          maxLength: model.maxLength ? true : false,
          minLength: model.minLength ? true : false,
          email: model.type === InputTypes.EMAIL_INPUT ? true : false,
          notUnique: model.unique === 1 ? true : false,
          pattern: isDefined(model.pattern) ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        pattern: model.pattern,
        minLength: model.minLength,
        maxLength: model.maxLength
      } as TextInput
    );
  }
}

export class DateInput extends AbstractHTMLFormControl {
  minDate: Date | string;
  maxDate: Date | string;
  currentDate: Date | string;
  dateInputFormat = 'dd/mm/yyyy';

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: DateInput) {
    super(value);
    this.minDate = value.minDate;
    this.maxDate = value.maxDate;
    this.currentDate = value.currentDate;
    this.dateInputFormat = value.dateInputFormat;
  }


  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new DateInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
          maxDate: isDefined(model.maxDate) ? true : false,
          minDate: isDefined(model.minDate) ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        // Date input parts
        minDate: model.minDate,
        maxDate: model.maxDate,
        currentDate: '',
        dateInputFormat: 'dd/mm/yyyy'
      } as DateInput
    );
  }
}

/**
 * @description Interface definition of an HTNL checkbox contrl
 */
export interface CheckboxItem {
  value: string;
  checked?: boolean;
  description?: string;
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new CheckBoxInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        // Date input parts
        items: [] // TODO Find a better way to load the items
      } as CheckBoxInput
    );
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new HiddenInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
      } as DateInput
    );
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new NumberInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
          max: isDefined(model.max) ? true : false,
          min: isDefined(model.min) ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        min: model.min,
        max: model.max
      } as NumberInput
    );
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new PasswordInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
          maxLength: model.maxLength ? true : false,
          minLength: model.minLength ? true : false,
          // notUnique: model.unique === 1 ? true : false,
          pattern: isDefined(model.pattern) ? true : false,
          // same: false,
          // invalidFormat: false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        pattern: model.pattern,
        minLength: model.minLength,
        maxLength: model.maxLength
      } as PasswordInput
    );
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new PhoneInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
          maxLength: model.maxLength ? true : false,
          minLength: model.minLength ? true : false,
          notUnique: model.unique === 1 ? true : false,
          pattern: isDefined(model.pattern) ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        pattern: model.pattern,
        minLength: model.minLength,
        maxLength: model.maxLength
      } as PhoneInput
    );
  }
}

/**
 * @description Interface definition of an HTML radio control
 */
export interface RadioItem {
  value: string;
  checked?: boolean;
  description?: string;
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new RadioInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        // Date input parts
        items: [] // TODO Find a better way to load the items
      } as RadioInput
    );
  }
}

/**
 * @description Interface definitions of a item of HTML select control
 */
export interface ISelectItem {
  id: any;
  name: string;
  type: string;
  description?: string;
}

/**
 * @description Selectable options control configuration definition class
 */
export class SelectInput extends AbstractHTMLFormControl {
  items: Array<any>;
  optionsLabel?: string;
  optionsValueIndex?: string | number;
  multiple?: boolean;
  groupByKey: string;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: SelectInput) {
    super(value);
    this.items = value.items;
    this.optionsLabel = value.optionsLabel;
    this.optionsValueIndex = value.optionsValueIndex;
    this.multiple = value.multiple ? value.multiple : false;
    this.groupByKey = value.groupByKey;
  }


  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new SelectInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        items: [], // TODO Find a better way to load the items and parse the option, value, and groupfields
        optionsLabel: '',
        optionsValueIndex: '',
        multiple: model.multiple === 1 ? true : false,
        groupByKey: '',
      } as SelectInput
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new TextAreaInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        formControlGroupIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        rows: model.rows,
        cols: model.columns
      } as TextAreaInput
    );
  }
}

export { IHTMLFormControl } from './contracts/dynamic-input-interface';
export { InputTypes } from './input-types';
export { IHTMLFormControlValidationRule } from './contracts/input-rules';
export { AbstractHTMLFormControl } from './abstract-dynamic-input';
export { IDynamicForm, DynamicForm } from './contracts/dynamic-form';
