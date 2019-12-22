import { IPayload } from './abstract-reducer';

export interface IAction {
  type: string;
  payload: IPayload;
}
