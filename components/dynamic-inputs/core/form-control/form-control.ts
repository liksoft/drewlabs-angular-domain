import { JsonProperty, ObjectSerializer } from 'src/app/lib/domain/built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from 'src/app/lib/domain/built-value/contracts/type';
import { IHTMLFormControl } from 'src/app/lib/domain/components/dynamic-inputs/core/contracts/dynamic-input-interface';
import { InputTypes } from 'src/app/lib/domain/components/dynamic-inputs/core/input-types';
import { FormControlModel, IDynamicFormBindableModel } from 'src/app/lib/domain/components/dynamic-inputs/core/contracts/form-control';
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
} from 'src/app/lib/domain/components/dynamic-inputs/core';

export class FormControlBuilder implements ISerializableBuilder<FormControl>, TypeBuilder<FormControl> {
  serializer: ISerializer;

  /**
   *
   */
  constructor() {
    this.serializer = new ObjectSerializer();
  }

  /**
   * @inheritdoc
   */
  fromSerialized(serialized: any): FormControl {
    return this.serializer.deserialize(FormControl, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: FormControl) {
    return this.serializer.serialize(FormControl, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => FormControl, params: object): FormControl {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: FormControl, params: object | FormControl): FormControl {
    return rebuildJSObjectType(instance, params);
  }

}

export function formControlModelToDynamicControl(model: FormControl): IHTMLFormControl {
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

export class FormControl implements FormControlModel, IDynamicFormBindableModel {
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
  children: FormControl[] = undefined;
  @JsonProperty('uniqueOn')
  uniqueOn: string = undefined;
  @JsonProperty('containerClass')
  dynamicControlContainerClass: string = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<FormControl> | ISerializableBuilder<FormControl> {
    return new FormControlBuilder();
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
      form_controls_label: 'label',
      form_controls_placeholder: 'placeholder',
      form_controls_type: 'type',
      form_controls_classes: 'classes',
      f_form_controls_required: 'required',
      f_form_controls_disabled: 'disabled',
      f_form_controls_read_only: 'readonly',
      f_form_controls_unique: 'unique',
      f_form_controls_pattern: 'pattern',
      form_controls_description: 'description',
      form_controls_max_length: 'maxLength',
      form_controls_min_length: 'minLength',
      form_controls_min: 'min',
      form_controls_max: 'max',
      form_controls_min_date: 'minDate',
      form_controls_max_date: 'maxDate',
      form_controls_selectable_values: 'selectableValues',
      form_controls_selectable_model: 'selectableModel',
      form_controls_multiple: 'multiple',
      form_controls_columns: 'columns',
      form_controls_rows: 'rows',
      f_form_controls_index: 'controlIndex',
      // 'options',
      f_form_controls_control_name: 'controlName',
      f_form_controls_value: 'value',
      f_form_controls_required_if: 'requiredIf',
      f_form_controls_form_id: 'formId',
      f_form_controls_form_control_id: 'id',
      // controlGroupKey
      // added keys
      f_form_controls_upload_url: 'uploadURL',
      f_form_controls_unique_on: 'uniqueOn',
      f_form_controls_is_repeatable: 'isRepeatable',
      f_form_controls_container_class: 'dynamicControlContainerClass'
    };
  }
}
