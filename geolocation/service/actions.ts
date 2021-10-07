import { createAction, DrewlabsFluxStore, StoreAction } from "../../rxjs/state";
import { GeoPosition } from "../types/geoposition";

const enum Actions {
  GEOLOCATION_CHANGE_ACTION = "GEOLOCATION_CHANGES",
}

interface GeolocationState {
  position: GeoPosition;
  error?: GeolocationPositionError | Error;
}

const onGeolocationPositionAction = (
  store: DrewlabsFluxStore<GeolocationState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Partial<GeolocationState>) => {
    return {
      type: Actions.GEOLOCATION_CHANGE_ACTION,
      payload,
    };
  });

export {
  Actions as GeolocationActions,
  onGeolocationPositionAction,
  GeolocationState,
};
