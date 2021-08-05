import { createAction, DrewlabsFluxStore, StoreAction } from "../../../../rxjs/state/rx-state";

const enum Actions {
    GEOLOCATION_CHANGE_ACTION = 'GEOLOCATION_CHANGES'
}

interface GeolocationState {
    position?: GeolocationPosition;
    error?: GeolocationPositionError;
}

const onGeolocationPositionAction = (store: DrewlabsFluxStore<GeolocationState, Partial<StoreAction>>) =>
    createAction(store, (payload: Partial<GeolocationState>) => {
        return {
            type: Actions.GEOLOCATION_CHANGE_ACTION,
            payload
        };
    });

export { Actions as GeolocationActions, onGeolocationPositionAction, GeolocationState };