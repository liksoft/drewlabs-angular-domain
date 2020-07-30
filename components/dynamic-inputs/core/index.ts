import { AbstractHTMLFormControl } from './abstract-dynamic-input';
import { IHTMLFormControl, HTMLFormControlRequireIfConfig } from './contracts/dynamic-input-interface';
import { FormControlModel } from './contracts/form-control';
import { IHTMLFormControlValidationRule } from './contracts/input-rules';
import { isDefined } from '../../../utils';
import { InputTypes } from './input-types';

/**
 * @description Interface definition of an HTNL checkbox contrl
 */
export interface CheckboxItem {
  value: string | number;
  checked?: boolean;
  description?: string;
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
 * @description Interface definition of an HTML radio control
 */
export interface RadioItem {
  value: string | number;
  checked?: boolean;
  description?: string;
}

function buildRequiredIfConfig(stringifiedConfig: string): HTMLFormControlRequireIfConfig {
  if (!isDefined(stringifiedConfig) || (stringifiedConfig.indexOf(':') === -1)) { return null; }
  // split the string into the two parts
  const parts = stringifiedConfig.split(':');
  return {
    formControlName: parts[0].trim(),
    values: parts[1].indexOf(',') !== -1 ? parts[1].split(',') : [parts[1]]
  };
}

function buildCheckboxItems(model: FormControlModel): CheckboxItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          value: isNaN(+idValueFields[0].trim()) ? idValueFields[0].trim() : +idValueFields[0].trim(),
          checked: i === 0,
          description: idValueFields[1].trim()
        };
      } else {
        return {
          value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          checked: i === 0,
          description: v.trim()
        };
      }
    });

  } else if (isDefined(model.selectableModel)) {
    const items = model.selectableModel.split('|');
    const keyField = items[2].replace('keyfield:', '');
    const valueField = items[4].replace('valuefield:', '');
    return model.options.map((v, index) => {
      return {
        value: v[keyField],
        checked: index === 0,
        description: v[valueField]
      } as CheckboxItem;
    });
  } else {
    return [];
  }
}

function buildSelectItems(model: FormControlModel): ISelectItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          id: isNaN(+idValueFields[0].trim()) ? idValueFields[0].trim() : +idValueFields[0].trim(),
          name: idValueFields[1].trim(),
          description: idValueFields[1].trim()
        } as ISelectItem;
      } else {
        return {
          id: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          name: v.trim(),
          description: v.trim()
        } as ISelectItem;
      }
    });

  } else if (isDefined(model.selectableModel)) {
    const items = model.selectableModel.split('|');
    const keyField = items[2].replace('keyfield:', '');
    const valueField = items[4].replace('valuefield:', '');
    return model.options.map((v, index) => {
      return {
        id: v[keyField],
        description: v[valueField],
        name: v[valueField]
      } as ISelectItem;
    });
  } else {
    return [];
  }
}

function buildRadioInputItems(model: FormControlModel): RadioItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          value: isNaN(+idValueFields[0].trim()) ? idValueFields[0].trim() : +idValueFields[0].trim(),
          checked: i === 0,
          description: idValueFields[1].trim()
        };
      } else {
        return {
          value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          checked: i === 0,
          description: v.trim()
        };
      }
    });

  } else if (isDefined(model.selectableModel)) {
    const items = model.selectableModel.split('|');
    const keyField = items[2].replace('keyfield:', '');
    const valueField = items[4].replace('valuefield:', '');
    return model.options.map((v, index) => {
      return {
        value: v[keyField],
        checked: index === 0,
        description: v[valueField]
      } as RadioItem;
    });
  } else {
    return [];
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        // Date input parts
        items: buildCheckboxItems(model)
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        // Date input parts
        items: buildRadioInputItems(model)
      } as RadioInput
    );
  }
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false,
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        items: buildSelectItems(model), // TODO Find a better way to load the items and parse the option, value, and groupfields
        optionsLabel: 'description',
        groupByKey: 'type',
        optionsValueIndex: 'id',
        multiple: model.multiple === 1 ? true : false
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
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
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

export class FileInput extends AbstractHTMLFormControl {
  uploadUrl: string;
  pattern: string;
  multiple: boolean;
  maxFileSize: number;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: FileInput) {
    super(value);
    this.uploadUrl = value.uploadUrl ? value.uploadUrl : null;
    this.pattern =  value.pattern ? value.pattern : null;
    this.multiple = value.multiple ? value.multiple : false;
    this.maxFileSize = value.maxFileSize ? value.maxFileSize : null;
  }


  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new FileInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        uploadUrl: model.uploadURL,
        pattern: model.pattern,
        multiple: model.multiple === 1 ? true : false,
        maxFileSize: model.max ? model.max : null
      } as FileInput
    );
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
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new HMTLInput(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
      } as HMTLInput
    );
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
    this.children = value.children ? value.children : null;
  }


  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(model: FormControlModel): IHTMLFormControl {
    return new InputGroup(
      {
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        uniqueCondition: model.uniqueOn,
        isRepeatable: model.isRepeatable === 1 ? true : false,
        containerClass: model.dynamicControlContainerClass,
        requiredIf: buildRequiredIfConfig(model.requiredIf),
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: model.required === 1 ? true : false
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: model.disabled === 1 ? true : false,
        readOnly: model.readonly === 1 ? true : false,
        descriptionText: model.description,
        children: model.children.map((v) => v.toDynamicControl())
      } as InputGroup
    );
  }
}

export { IHTMLFormControl } from './contracts/dynamic-input-interface';
export { InputTypes } from './input-types';
export { IHTMLFormControlValidationRule } from './contracts/input-rules';
export { AbstractHTMLFormControl } from './abstract-dynamic-input';
export { IDynamicForm, DynamicForm } from './contracts/dynamic-form';
export { FormService } from './form-control/form.service';
