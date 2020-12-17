import { JsonProperty, ObjectSerializer } from '../../../../built-value/core/serializers';
import { ISerializableBuilder } from '../../../../built-value/contracts/serializers';
import { TypeBuilder } from '../../../../built-value/contracts/type';
import { GenericSerializaleSerializer } from '../../../../built-value/core/js/serializer';

// tslint:disable-next-line: max-line-length
import {
  DateInput,
  SelectInput,
  TextAreaInput,
  NumberInput,
  PhoneInput,
  PasswordInput,
  CheckBoxInput,
  RadioInput,
  TextInput,
  HiddenInput,
  FileInput,
  HMTLInput
} from '../input-types';
import { InputTypes } from '../contracts/input-types';
import { IHTMLFormControl } from '../contracts/dynamic-input';
import { DynamicFormControlInterface } from '../compact/types';

export function formControlModelToDynamicControl(model: DynamicFormControlInterface): IHTMLFormControl {
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

export class FormControl implements DynamicFormControlInterface {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('formId')
  formId: number = undefined;
  @JsonProperty('formFormControlId')
  formFormControlId: number = undefined;
  @JsonProperty('label')
  label: string = undefined;
  @JsonProperty('placeholder')
  placeholder: string = undefined;
  @JsonProperty('type')
  type: string = undefined;
  @JsonProperty('classes')
  classes: string = undefined;
  @JsonProperty('required')
  required: number = undefined;
  @JsonProperty('disabled')
  disabled: number = undefined;
  @JsonProperty('readonly')
  readonly: number = undefined;
  @JsonProperty('unique')
  unique: number = undefined;
  @JsonProperty('pattern')
  pattern: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty('maxLength')
  maxLength: number = undefined;
  @JsonProperty('minLength')
  minLength: number = undefined;
  @JsonProperty('min')
  min: number = undefined;
  @JsonProperty('max')
  max: number = undefined;
  @JsonProperty('minDate')
  minDate: string = undefined;
  @JsonProperty('maxDate')
  maxDate: string = undefined;
  @JsonProperty('selectableValues')
  selectableValues: string = undefined;
  @JsonProperty('selectableModel')
  selectableModel: string = undefined;
  @JsonProperty('multiple')
  multiple: number = undefined;
  @JsonProperty('controlGroupKey')
  controlGroupKey: string = undefined;
  @JsonProperty('controlName')
  controlName: string = undefined;
  @JsonProperty('controlIndex')
  controlIndex: number = undefined;
  @JsonProperty('options')
  options: object[] = undefined;
  @JsonProperty('rows')
  rows: number = undefined;
  @JsonProperty('columns')
  columns: number = undefined;
  @JsonProperty('value')
  value: string = undefined;
  @JsonProperty('requiredIf')
  requiredIf: string = undefined;
  @JsonProperty('uploadURL')
  uploadURL: string = undefined;
  @JsonProperty('isRepeatable')
  isRepeatable: number = undefined;
  @JsonProperty({ name: 'children', valueType: FormControl })
  children: DynamicFormControlInterface[] = undefined;
  @JsonProperty('uniqueOn')
  uniqueOn: string = undefined;
  @JsonProperty('containerClass')
  dynamicControlContainerClass: string = undefined;
  @JsonProperty('valuefield')
  valuefield: string = undefined;
  @JsonProperty('groupfield')
  groupfield: string = undefined;
  @JsonProperty('keyfield')
  keyfield: string = undefined;


  static builder(): TypeBuilder<FormControl> | ISerializableBuilder<FormControl> {
    return new GenericSerializaleSerializer(FormControl, new ObjectSerializer());
  }

  /**
   * @description Returns the control configuration corresponding to this form control
   */
  toDynamicControl(): IHTMLFormControl {
    return formControlModelToDynamicControl(this);
  }

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return {
      label: 'label',
      placeholder: 'placeholder',
      type: 'type',
      classes: 'classes',
      required: 'required',
      disabled: 'disabled',
      read_only: 'readonly',
      unique: 'unique',
      pattern: 'pattern',
      description: 'description',
      max_length: 'maxLength',
      min_length: 'minLength',
      min: 'min',
      max: 'max',
      min_date: 'minDate',
      max_date: 'maxDate',
      selectable_values: 'selectableValues',
      selectable_model: 'selectableModel',
      multiple: 'multiple',
      columns: 'columns',
      rows: 'rows',
      index: 'controlIndex',
      control_name: 'controlName',
      value: 'value',
      required_if: 'requiredIf',
      form_id: 'formId',
      form_control_id: 'id',
      upload_url: 'uploadURL',
      unique_on: 'uniqueOn',
      is_repeatable: 'isRepeatable',
      container_class: 'dynamicControlContainerClass'
    };
  }
}
