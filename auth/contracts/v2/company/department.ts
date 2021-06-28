import { RoleV2 } from '../authorizations/role';
import { isDefined, isArray } from '../../../../utils/types/type-utils';

export class DepartmentV2 {
  id!: number;
  name!: string;
  description!: string;
  organisationID!: number | string;
  roles!: RoleV2[];

  get rolesAsString() {
    return isDefined(this.roles) ? isArray(this.roles) ? this.roles.map(role => role.label).join(', ') : this.roles : '';
  }

  static getJsonableProperties(): { [index: string]: keyof DepartmentV2 } | { [index: string]: any } {
    return {
      id: 'id',
      name: 'name',
      description: 'description',
      organisation_id: 'organisationID',
      roles: 'roles',
    };
  }
}

export const departmentFormViewModelBindings = (): { [index: string]: any } => {
  return {
    name: 'name',
    description: 'description',
    organisation_id: 'organisationID',
    roles: 'roles'
  };
};
