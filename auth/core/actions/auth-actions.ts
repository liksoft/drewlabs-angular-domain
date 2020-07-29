import { createAction, DrewlabsFluxStore, StateAction } from '../../../rxjs/state/rx-state';
import { AuthState } from '../types';
import { Log } from '../../../utils/logger';

export enum AuthStoreActions {
  INIT_AUTHENTICATION_STATE_ACTION = '[INIT_AUTHENTICATION_STATE]',
  AUTHENTICATING_ACTION = '[AUTHENTICATING]',
  AUTHENTICATION_REQUEST_COMPLETED = '[AUTHENTICATION_COMPLETED]'
}

export interface AuthStateAction extends StateAction {
  payload: Partial<AuthState> | boolean;
}

export const authenticatingAction = (store: DrewlabsFluxStore<Partial<AuthState>, Partial<AuthStateAction>>) =>
  createAction(store, () => {
    return {
      type: AuthStoreActions.AUTHENTICATING_ACTION,
    };
  });

export const authenticationRequestCompletedAction = (store: DrewlabsFluxStore<Partial<AuthState>, Partial<AuthStateAction>>) =>
  createAction(store, (payload: boolean) => {
    return {
      type: AuthStoreActions.AUTHENTICATION_REQUEST_COMPLETED,
      payload
    };
  });

export const intitAuthStateAction = (store: DrewlabsFluxStore<Partial<AuthState>, Partial<AuthStateAction>>) =>
  createAction(store, (payload: Partial<AuthState>) => {
    return {
      type: AuthStoreActions.INIT_AUTHENTICATION_STATE_ACTION,
      payload
    };
  });
