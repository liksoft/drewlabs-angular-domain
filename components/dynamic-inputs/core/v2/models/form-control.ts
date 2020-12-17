import { ISerializableBuilder } from '../../../../../built-value/contracts';
import { GenericSerializaleSerializer, GenericUndecoratedSerializaleSerializer, UndecoratedSerializer } from '../../../../../built-value/core/js/serializer';
import { DynamicFormControlInterface } from '../../compact/types';

export class FormControlV2 implements DynamicFormControlInterface {
  id: number = undefined;
  formId: number = undefined;
  formFormControlId: number = undefined;
  label: string = undefined;
  placeholder: string = undefined;
  type: string = undefined;
  classes: string = undefined;
  required: number = undefined;
  disabled: number = undefined;
  readonly: number = undefined;
  unique: number = undefined;
  pattern: string = undefined;
  description: string = undefined;
  maxLength: number = undefined;
  minLength: number = undefined;
  min: number = undefined;
  max: number = undefined;
  minDate: string = undefined;
  maxDate: string = undefined;
  selectableValues: string = undefined;
  selectableModel: string = undefined;
  multiple: number = undefined;
  controlGroupKey: string = undefined;
  controlName: string = undefined;
  controlIndex: number = undefined;
  options: object[] = undefined;
  rows: number = undefined;
  columns: number = undefined;
  value: string = undefined;
  requiredIf: string = undefined;
  uploadURL: string = undefined;
  isRepeatable: number = undefined;
  children: DynamicFormControlInterface[] = undefined;
  uniqueOn: string = undefined;
  dynamicControlContainerClass: string = undefined;
  valuefield: string = undefined;
  groupfield: string = undefined;
  keyfield: string = undefined;

  static builder(): ISerializableBuilder<FormControlV2> {
    return new GenericSerializaleSerializer(FormControlV2, new UndecoratedSerializer());
  }

  public static getJsonableProperties(): { [index: string]: keyof FormControlV2 | { name: string, type: any } } {
    return {
      id: 'id',
      formId: 'formId',
      formFormControlId: 'formFormControlId',
      label: 'label',
      placeholder: 'placeholder',
      type: 'type',
      classes: 'classes',
      required: 'required',
      disabled: 'disabled',
      readonly: 'readonly',
      unique: 'unique',
      pattern: 'pattern',
      description: 'description',
      maxLength: 'maxLength',
      minLength: 'minLength',
      min: 'min',
      max: 'max',
      minDate: 'minDate',
      maxDate: 'maxDate',
      selectableValues: 'selectableValues',
      selectableModel: 'selectableModel',
      multiple: 'multiple',
      controlGroupKey: 'controlGroupKey',
      controlName: 'controlName',
      controlIndex: 'controlIndex',
      options: 'options',
      rows: 'rows',
      columns: 'columns',
      value: 'value',
      requiredIf: 'requiredIf',
      uploadURL: 'uploadURL',
      isRepeatable: 'isRepeatable',
      children: { name: 'children', type: FormControlV2 },
      uniqueOn: 'uniqueOn',
      containerClass: 'dynamicControlContainerClass',
      valuefield: 'valuefield',
      groupfield: 'groupfield',
      keyfield: 'keyfield'
    };
  }
}

export class FormControlRequestBody {
  label: string;
  placeholder: string;
  type: string;
  classes: string;
  description: string;
  maxLength: number;
  minLength: number;
  min: number;
  max: number;
  minDate: string;
  maxDate: string;
  selectableValues: string;
  selectableModel: string;
  modelFilters: string;
  multiple: boolean;
  columns: number;
  rows: number;

  static builder(): ISerializableBuilder<FormControlRequestBody> {
    return new GenericSerializaleSerializer(FormControlRequestBody, new UndecoratedSerializer());
  }

  public static getJsonableProperties(): { [prop: string]: keyof FormControlRequestBody } {
    return {
      label: 'label',
      placeholder: 'placeholder',
      type: 'type',
      classes: 'classes',
      description: 'description',
      max_length: 'maxLength',
      min_length: 'minLength',
      min: 'min',
      max: 'max',
      min_date: 'minDate',
      max_date: 'maxDate',
      selectable_values: 'selectableValues',
      selectable_model: 'selectableModel',
      model_filters: 'modelFilters',
      multiple: 'multiple',
      columns: 'columns',
      rows: 'rows'
    };
  }

  public toSerialize(): { [prop: string]: any } {
    const serialized = {};
    Object.entries(FormControlRequestBody.getJsonableProperties()).forEach(([key, value]) => {
      serialized[key] = this[value];
    });
    return serialized;
  }
}

export class FormFormControlRequestBody {
  formId: number;
  formControlId: number;
  controlName: string;
  formControlGroupId: number | string;
  index: number;
  value: string | number;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  unique: boolean;
  pattern: string;
  requiredIf: string;
  uploadUrl: string;
  repeatable: boolean;
  uniqueOn: string;
  containerClass: string;

  static builder(): ISerializableBuilder<FormFormControlRequestBody> {
    return new GenericSerializaleSerializer(FormFormControlRequestBody, new UndecoratedSerializer());
  }

  public static getJsonableProperties(): { [prop: string]: keyof FormFormControlRequestBody } {
    return {
      form_id: 'formId',
      form_control_id: 'formControlId',
      control_name: 'controlName',
      form_control_group_id: 'formControlGroupId',
      index: 'index',
      value: 'value',
      required: 'required',
      disabled: 'disabled',
      read_only: 'readOnly',
      unique: 'unique',
      pattern: 'pattern',
      required_if: 'requiredIf',
      upload_url: 'uploadUrl',
      repeatable: 'repeatable',
      unique_on: 'uniqueOn',
      container_class: 'containerClass',
    };
  }

  public toSerialize(): { [prop: string]: any } {
    const serialized = {};
    Object.entries(FormFormControlRequestBody.getJsonableProperties()).forEach(([key, value]) => {
      serialized[key] = this[value];
    });
    return serialized;
  }
}

export const serializeControlRequestBodyUsing = (value: any) => {
  return (new GenericUndecoratedSerializaleSerializer()
    .fromSerialized(FormControlRequestBody, value) as FormControlRequestBody).toSerialize() as { [index: string]: any };
};

export const serializeFormFormControlRequestBodyUsing = (value: any) => {
  return (new GenericUndecoratedSerializaleSerializer()
    .fromSerialized(FormFormControlRequestBody, value) as FormFormControlRequestBody).toSerialize() as { [index: string]: any };
};
