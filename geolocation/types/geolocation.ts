import { Observable } from "rxjs";
import { GeoPosition } from "./geoposition";

export interface GeolocationManager {

  // Observable of the platform geo position errors
  readonly error$: Observable<GeolocationPositionError|Error|undefined>;

  // Observable of the platform geo positions
  readonly state$: Observable<GeoPosition>;

  // Observable producing the Geoposition changes
  readonly changes$: Observable<GeoPosition>;

  // Observable producing the current geo position
  readonly currentPosition$: Observable<GeoPosition>;

  /**
   * @description Returns the cached user geoposition
   */
  getPosition(): GeoPosition;

  /**
   * Platform current position initializer func
   */
  getPlatformCurrentPosition(): void;
}
