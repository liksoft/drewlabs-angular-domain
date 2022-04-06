import { Observable } from 'rxjs';
import { CheckboxItem, SelectSourceInterface, RadioItem } from '../../core';

/**
 * Union abstraction arround item in option element, Radio
 * element or Checkbox element on the platform native form
 * element
 */
export type SelectableControlItems =
  | Observable<Array<SelectSourceInterface | CheckboxItem | RadioItem>>
  | Array<SelectSourceInterface | CheckboxItem | RadioItem>;

/**
 * Defines the type of content published when dynamic input
 * DOM event occurs
 */
export interface InputEventArgs {
  name: string;
  value: any;
}
