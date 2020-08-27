import { AppWorkspace, IAppWorkspace } from '../workspace/workspace';

export interface IAppUserDetails extends IWorkspaceUserDetails {
  id: number | string;
  firstname: string;
  lastname: string;
  address: string;
  phoneNumber: string;
  emails: string[];
  sex?: string;
  profileURL?: string;
  company?: string;
  disvision?: string;
  department?: string;
  email: string;
  isManager?: boolean;
  departmentID: number;
  agenceID: number;
}

export interface IWorkspaceUserDetails {
  workspaces: IAppWorkspace[];
}


export class AppUserDetails implements IAppUserDetails {

  id: string | number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: string;
  phoneNumber: string;
  postalCode: string;
  emails: string[];
  sex: string;
  profileURL: string;
  company: string;
  disvision: string;
  department: string;
  isManager?: boolean;
  workspaces: IAppWorkspace[]; // organisation_id
  departmentID: number;
  agenceID: number;
  organisationID: number;

  get email(): string { return this.emails[0]; }

  static getJsonableProperties(): {[index: string]: keyof AppUserDetails}|{[index: string]: any} {
    return {
      id: 'id',
      firstname: 'firstname',
      lastname: 'lastname',
      address: 'address',
      phone_number: 'phoneNumber',
      postal_code: 'postalCode',
      birthdate: 'birthdate',
      sex: 'sex',
      profile_url: 'profileURL',
      organisation_name: 'company',
      division: 'disvision',
      department: 'department',
      agence_id: 'agenceID',
      department_id: 'departmentID',
      organisation_id: 'organisationID',
      is_manager: 'isManager',
      workspaces: {name: 'workspaces', type: AppWorkspace}
    };
  }
}
