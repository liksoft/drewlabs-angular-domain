import { StoreAction } from "../../rxjs/state";
import { GeolocationActions, GeolocationState } from "./actions";

export const geolocationReducer = (
  state: GeolocationState,
  action: Partial<StoreAction>
) => {
  switch (action.type) {
    case GeolocationActions.GEOLOCATION_CHANGE_ACTION:
      return {
        ...state,
        ...action?.payload,
      } as GeolocationState;
    default:
      return state;
  }
};
