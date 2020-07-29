import { IAppWorkspace } from '../workspace/workspace';

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

  workspaces: IAppWorkspace[];

  static getJsonableProperties() {
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
      // workspaces: {name: 'workspaces', type: AppWorkspace}
    };
  }
}
