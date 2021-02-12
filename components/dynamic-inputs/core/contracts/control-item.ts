

/**
 * @description Latest definition type for Platform Select Control
 */
export interface SelectSourceInterface {
  value: any;
  description?: string;
}

/**
 * @description Interface definition of an HTNL checkbox contrl
 */
export interface CheckboxItem  extends SelectSourceInterface {
  checked?: boolean;
}

/**
 * @description Interface definitions of a item of HTML select control
 */
export interface ISelectItem extends SelectSourceInterface {
  name: string;
  type: string;
}


/**
 * @description Interface definition of an HTML radio control
 */
export interface RadioItem extends SelectSourceInterface {
  checked?: boolean;
  description?: string;
}
