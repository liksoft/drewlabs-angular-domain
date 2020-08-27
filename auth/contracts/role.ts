import { IPermission } from './permission';

/**
 * @deprecated
 */
export interface Role {
  id: any;
  label: string;
  displayLabel: string;
  description: string;
  permissions: IPermission[];
}
