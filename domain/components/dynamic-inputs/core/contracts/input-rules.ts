
/**
 * @description Interface definition of input controles validation rules
 */
export interface IHTMLFormControlValidationRule {
  isRequired: boolean;
  maxLength?: boolean;
  minLength?: boolean;
  max?: boolean;
  min?: boolean;
  maxDate?: boolean;
  minDate?: boolean;
  email?: boolean;
  notUnique?: boolean;
  pattern?: boolean;
  same?: boolean;
  invalidFormat?: boolean;
}
