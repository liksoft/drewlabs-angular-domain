import { Inject, Injectable, InjectionToken, OnDestroy } from "@angular/core";
import { tap, takeUntil, map } from "rxjs/operators";
import { createSubject } from "../../rxjs/helpers";
import { createStore } from "../../rxjs/state/rx-state";
import { SessionStorage } from "../../storage/core";
import {
  DEFAULT_POSITION_OPTIONS,
  GEOLOCATION,
  IS_GEOLOCATION_SUPPORTED,
} from "../tokens/geolocation";
import { GeolocationState, onGeolocationPositionAction } from "./actions";
import { geolocationReducer } from "./reducers";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { isEmpty } from "lodash";
import { createGeoposition, GeoPosition } from "../types/geoposition";
import { GeolocationManager } from "../types/geolocation";

const BROWSER_POSITION_SESSION_KEY = "CLIENT_GEOLOCATION_LOCATION";

// @external
// Provides an interface to the Geolocation services
export const GEOLOCATION_MANAGER = new InjectionToken<GeolocationManager>(
  "Instance of the GeolocationManager interface"
);

@Injectable({
  providedIn: "root",
})
export class GeolocationService implements GeolocationManager, OnDestroy {
  private _destroy$ = createSubject();
  private _watchPositionId = 0;

  // @internal
  private readonly _changes$ = createSubject<GeoPosition>(1);

  // Observable producing the Geoposition changes
  public readonly changes$ = this._changes$.asObservable();

  private readonly _currentPosition$ = createSubject<GeoPosition>(1);

  // Observable producing the current geo position
  public readonly currentPosition$ = this._currentPosition$.asObservable();

  // A Geolocation store provider
  public readonly store$ = createStore(geolocationReducer, {
    position: {} as GeoPosition,
    error: undefined,
  });

  public tempPosition!: GeoPosition;

  public readonly error$ = this.store$
    .connect()
    .pipe(map((state) => state.error));

  public readonly state$ = this.store$.connect().pipe(
    map((state) => state.position),
    takeUntil(
      this._destroy$.pipe(
        tap((_) => {
          this.geolocationRef.clearWatch(this._watchPositionId);
          this.session.delete(BROWSER_POSITION_SESSION_KEY);
        })
      )
    ),
    tap((state) => {
      if (state) {
        this.setPosition(state);
      }
    })
  );

  getPosition(): GeoPosition {
    let value = this.session.get(BROWSER_POSITION_SESSION_KEY);
    value = isEmpty(value) ? this.tempPosition : value;
    return this.tempPosition;
  }

  private setPosition(position: GeoPosition) {
    if (position) {
      this.tempPosition = position;
      this.session.set(BROWSER_POSITION_SESSION_KEY, position);
    }
  }

  constructor(
    @Inject(GEOLOCATION) private geolocationRef: Geolocation,
    @Inject(IS_GEOLOCATION_SUPPORTED) isGeolocationSupported: boolean,
    @Inject(DEFAULT_POSITION_OPTIONS) private positionOptions: PositionOptions,
    private session: SessionStorage
  ) {
    if (!isGeolocationSupported) {
      this._changes$.error("Geolocation is not supported in your browser");
      onGeolocationPositionAction(this.store$)({
        error: new Error("Geolocation is not supported in your browser"),
      } as Partial<GeolocationState>);
    }
    this._watchPositionId = this.geolocationRef.watchPosition(
      (position) => {
        const _position = createGeoposition(position);
        this._changes$.next(_position);
        onGeolocationPositionAction(this.store$)({
          position: _position,
          error: undefined,
        } as Partial<GeolocationState>);
      },
      (error: GeolocationPositionError) => {
        this._changes$.error(error);
        onGeolocationPositionAction(this.store$)({
          error,
        } as Partial<GeolocationState>);
      },
      this.positionOptions
    );
  }

  public getPlatformCurrentPosition(): void {
    // Get the current position
    this.geolocationRef.getCurrentPosition(
      (position) => {
        const _position = createGeoposition(position);
        this._currentPosition$.next(_position);
        onGeolocationPositionAction(this.store$)({
          position: _position,
          error: undefined,
        } as Partial<GeolocationState>);
      },
      (error) => {
        this._currentPosition$.error(error);
        onGeolocationPositionAction(this.store$)({
          position: undefined,
          error,
        } as Partial<GeolocationState>);
      },
      this.positionOptions
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this.store$.destroy();
  }
}

@Injectable()
export class GeolocationInterceptorService implements HttpInterceptor {
  constructor(
    @Inject(GEOLOCATION_MANAGER) private service: GeolocationManager
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const position = this.service.getPosition();
    if (position) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      req = req.clone({
        headers: req.headers
          .set("X-CLIENT-LAT", `${position?.coords?.latitude}`)
          .set("X-CLIENT-LONG", `${position?.coords?.longitude}`),
      });
    }
    return next.handle(req);
  }
}
