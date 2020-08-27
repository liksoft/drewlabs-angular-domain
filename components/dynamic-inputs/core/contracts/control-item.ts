
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
