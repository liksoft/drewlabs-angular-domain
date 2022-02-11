import { Authorization } from './authorization';

export class RoleV2 {
  id!: number;
  label!: string;
  displayLabel!: string;
  description!: string;
  authorizations!: string[] | Authorization[];

  // tslint:disable-next-line: variable-name
  private _isAdminRole!: number;
  get isAdminRole(): number {
    return Number(this._isAdminRole);
  }
  set isAdminRole(value: number) {
    this._isAdminRole = value;
  }

  static getJsonableProperties(): { [index: string]: keyof RoleV2 } | { [index: string]: any } {
    return {
      id: 'id',
      label: 'label',
      display_label: 'displayLabel',
      description: 'description',
      is_admin_user_role: 'isAdminRole',
      authorizations: { name: 'authorizations', type: Authorization },
    };
  }
}

export const roleFormViewBindings = () => ({
  label: 'label',
  display_label: 'displayLabel',
  description: 'description',
  is_admin_user_role: 'isAdminRole',
  authorizations: 'authorizations'
});
