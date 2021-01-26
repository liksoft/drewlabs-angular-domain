
// import {
//   DateInput,
//   SelectInput,
//   TextAreaInput,
//   NumberInput,
//   PhoneInput,
//   PasswordInput,
//   CheckBoxInput,
//   RadioInput,
//   TextInput,
//   HiddenInput,
//   FileInput,
//   HMTLInput
// } from '../input-types';
// import { InputTypes } from '../contracts/input-types';
// import { IHTMLFormControl } from '../contracts/dynamic-input';
// import { GenericSerializaleSerializer } from '../../../../built-value/core/js/serializer';
// import { DynamicFormControlInterface } from '../compact/types';
// import { UndecoratedSerializer } from '../../../../built-value/core/js/serializer';

// export function formControlModelToDynamicControl(model: DynamicFormControlInterface): IHTMLFormControl {
//   switch (model.type) {
//     case InputTypes.DATE_INPUT:
//       return DateInput.fromFormControlModel(model);
//     case InputTypes.SELECT_INPUT:
//       return SelectInput.fromFormControlModel(model);
//     case InputTypes.TEXTAREA_INPUT:
//       return TextAreaInput.fromFormControlModel(model);
//     case InputTypes.NUMBER_INPUT:
//       return NumberInput.fromFormControlModel(model);
//     case InputTypes.PHONE_INPUT:
//       return PhoneInput.fromFormControlModel(model);
//     case InputTypes.PASSWORD_INPUT:
//       return PasswordInput.fromFormControlModel(model);
//     case InputTypes.CHECKBOX_INPUT:
//       return CheckBoxInput.fromFormControlModel(model);
//     case InputTypes.RADIO_INPUT:
//       return RadioInput.fromFormControlModel(model);
//     case InputTypes.EMAIL_INPUT:
//       return TextInput.fromFormControlModel(model);
//     case InputTypes.HIDDEN_INPUT:
//       return HiddenInput.fromFormControlModel(model);
//     case InputTypes.FILE_INPUT:
//       return FileInput.fromFormControlModel(model);
//     case InputTypes.HTML_INPUT:
//       return HMTLInput.fromFormControlModel(model);
//     default:
//       return TextInput.fromFormControlModel(model);
//   }
// }

// export class FormControl implements DynamicFormControlInterface {
//   id: number = undefined;
//   formId: number = undefined;
//   formFormControlId: number = undefined;
//   label: string = undefined;
//   placeholder: string = undefined;
//   type: string = undefined;
//   classes: string = undefined;
//   required: number = undefined;
//   disabled: number = undefined;
//   readonly: number = undefined;
//   unique: number = undefined;
//   pattern: string = undefined;
//   description: string = undefined;
//   maxLength: number = undefined;
//   minLength: number = undefined;
//   min: number = undefined;
//   max: number = undefined;
//   minDate: string = undefined;
//   maxDate: string = undefined;
//   selectableValues: string = undefined;
//   selectableModel: string = undefined;
//   multiple: number = undefined;
//   controlGroupKey: string = undefined;
//   controlName: string = undefined;
//   controlIndex: number = undefined;
//   options: object[] = undefined;
//   rows: number = undefined;
//   columns: number = undefined;
//   value: string = undefined;
//   requiredIf: string = undefined;
//   uploadURL: string = undefined;
//   isRepeatable: number = undefined;
//   children: DynamicFormControlInterface[] = undefined;
//   uniqueOn: string = undefined;
//   dynamicControlContainerClass: string = undefined;
//   valuefield: string = undefined;
//   groupfield: string = undefined;
//   keyfield: string = undefined;


//   static builder() {
//     return new GenericSerializaleSerializer(FormControl, new UndecoratedSerializer);
//   }

//   static getJsonableProperties(): { [index: string]: keyof FormControl } | { [index: string]: { name: string, type: any } } {
//     return {
//       id: 'id',
//       formId: 'formId',
//       formFormControlId: 'formFormControlId',
//       label: 'label',
//       placeholder: 'placeholder',
//       type: 'type',
//       classes: 'classes',
//       required: 'required',
//       disabled: 'disabled',
//       readonly: 'readonly',
//       unique: 'unique',
//       pattern: 'pattern',
//       description: 'description',
//       maxLength: 'maxLength',
//       minLength: 'minLength',
//       min: 'min',
//       max: 'max',
//       minDate: 'minDate',
//       maxDate: 'maxDate',
//       selectableValues: 'selectableValues',
//       selectableModel: 'selectableModel',
//       multiple: 'multiple',
//       controlGroupKey: 'controlGroupKey',
//       controlName: 'controlName',
//       controlIndex: 'controlIndex',
//       options: 'options',
//       rows: 'rows',
//       columns: 'columns',
//       value: 'value',
//       requiredIf: 'requiredIf',
//       uploadURL: 'uploadURL',
//       isRepeatable: 'isRepeatable',
//       children: 'children',
//       uniqueOn: 'uniqueOn',
//       containerClass: 'dynamicControlContainerClass',
//       valuefield: 'valuefield',
//       groupfield: 'groupfield',
//       keyfield: 'keyfield',
//     };
//   }

//   /**
//    * @description Returns the control configuration corresponding to this form control
//    */
//   toDynamicControl(): IHTMLFormControl {
//     return formControlModelToDynamicControl(this);
//   }

//   /**
//    * @inheritdoc
//    */
//   formViewModelBindings(): { [index: string]: any } {
//     return {
//       label: 'label',
//       placeholder: 'placeholder',
//       type: 'type',
//       classes: 'classes',
//       required: 'required',
//       disabled: 'disabled',
//       read_only: 'readonly',
//       unique: 'unique',
//       pattern: 'pattern',
//       description: 'description',
//       max_length: 'maxLength',
//       min_length: 'minLength',
//       min: 'min',
//       max: 'max',
//       min_date: 'minDate',
//       max_date: 'maxDate',
//       selectable_values: 'selectableValues',
//       selectable_model: 'selectableModel',
//       multiple: 'multiple',
//       columns: 'columns',
//       rows: 'rows',
//       index: 'controlIndex',
//       control_name: 'controlName',
//       value: 'value',
//       required_if: 'requiredIf',
//       form_id: 'formId',
//       form_control_id: 'id',
//       upload_url: 'uploadURL',
//       unique_on: 'uniqueOn',
//       is_repeatable: 'isRepeatable',
//       container_class: 'dynamicControlContainerClass'
//     };
//   }
// }
