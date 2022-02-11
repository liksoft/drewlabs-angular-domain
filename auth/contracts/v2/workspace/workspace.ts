import { isNumber } from '../../../../utils';

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
  id!: number;
  label!: string;
  description!: string;
  status!: number|boolean;
  bannerURL!: string;
  profileURL!: string;
  type!: string;
  workspaceTypeID!: number;

  get isActive(): boolean {
    return isNumber(this.status) ? (+this.status === 1) : Boolean(this.status);
  }

  static getJsonableProperties(): {[index: string]: keyof AppWorkspace} {
    return {
      id: 'id',
      label: 'label',
      description: 'description',
      status: 'status',
      banner_url: 'bannerURL',
      type : 'type',
      workspace_type_id: 'workspaceTypeID',
      profile_url: 'profileURL'
    };
  }
}
