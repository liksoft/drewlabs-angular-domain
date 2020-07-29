import { isNumber } from '../../../../utils/types/type-utils';

export interface IAppWorkspace {
  id: number;
  label: string;
  description?: string;
  isActive: boolean;
  bannerURL: string;
  type: string;
  workspaceTypeID: string|number;
}


export class AppWorkspace implements IAppWorkspace {
  id: number;
  label: string;
  description: string;
  status: number|boolean;
  bannerURL: string;
  profilURL: string;
  type: string;
  workspaceTypeID: number;

  get isActive() {
    return isNumber(this.status) ? (+this.status === 1) : Boolean(this.status);
  }

  static getJsonableProperties() {
    return {
      id: 'id',
      label: 'label',
      description: 'description',
      status: 'status',
      banner_url: 'bannerURL',
      type : 'type',
      profil_url: 'profilURL',
      workspace_type_id: 'workspaceTypeID',
      profile_url: 'profileURL'
    };
  }
}
