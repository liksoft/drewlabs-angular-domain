import { IPermission } from './permission';

export interface Role {
  id: any;
  label: string;
  displayLabel: string;
  description: string;
  permissions: IPermission[];
}
