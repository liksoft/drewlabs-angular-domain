import { Observable } from "rxjs";
import {
  CheckboxItem,
  ISelectItem,
  RadioItem,
} from "../../core/contracts/control-item";

/**
 * Group the type definitions of select item list
 */
export type SelectableControlItems =
  | Observable<Array<ISelectItem | CheckboxItem | RadioItem>>
  | Array<ISelectItem | CheckboxItem | RadioItem>;

/**
 * Defines the type of content published when dynamic input
 * DOM event occurs
 */
export interface InputEventArgs {
  name: string;
  value: any;
}
