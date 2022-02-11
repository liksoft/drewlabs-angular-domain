import { AuthState, AuthStateAction, AuthStoreActions } from '../actions';

export function authReducer(state: Partial<AuthState>, action: Partial<AuthStateAction>) {
  switch (action.type) {
    case AuthStoreActions.AUTHENTICATING_ACTION:
      return {
        ...state,
        authenticating: true,
        signingOut: false
      };
    case AuthStoreActions.INIT_AUTHENTICATION_STATE_ACTION:
      return {
        ...state,
        ...(action.payload as Partial<AuthState>),
        authenticating: false
      };
    case AuthStoreActions.AUTHENTICATION_REQUEST_COMPLETED:
      return {
        ...state,
        ...(action.payload as Partial<AuthState>),
        authenticating: false
      };
    default:
      return state;
  }
}
