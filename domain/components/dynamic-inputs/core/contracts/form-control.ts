export interface FormControlModel {
  label: string;
  placeholder: string;
  type: string;
  classes: string;
  required: number;
  disabled: number;
  readonly: number;
  unique: number;
  pattern: string;
  description: string;
  maxLength: number;
  minLength: number;
  min: number;
  max: number;
  minDate: string;
  maxDate: string;
  selectableValues: string;
  selectableModel: string;
  multiple: number;
  controlGroupKey: string;
  controlName: string;
  controlIndex: number;
  options: object[];
  rows: number;
  columns: number;
  value: string;
}
