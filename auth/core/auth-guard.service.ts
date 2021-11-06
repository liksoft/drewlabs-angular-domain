import { Injectable, OnDestroy } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  Route,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { AuthPathConfig } from "./config";
import { Observable } from "rxjs";
import { AuthTokenService } from "../../auth-token/core/auth-token.service";
import { filter, map, takeUntil, tap } from "rxjs/operators";
import { userCanAny, Authorizable, userCan } from "../contracts/v2/user/user";
import { createSubject } from "../../rxjs/helpers/index";
import { doLog } from "../../rxjs/operators";

/**
 * @description Authentication guard
 */
@Injectable()
export class AuthGuardService
  implements CanActivate, CanActivateChild, CanLoad, OnDestroy
{
  private authState$ = this.auth.state$;
  // tslint:disable-next-line: variable-name
  private _destroy$ = createSubject();

  constructor(private router: Router, private auth: AuthService) {}

  /**
   * @description Handle for component instance activation.
   * Check if user is authenticated before authorizing access to the current component
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  /**
   * @description CanActivate guard appliqué aux enfants de composants dont l'accès requiert que l'utilisateur soit authentifié
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * @description CanActivate guard appliqué aux module dont le chargement requiert que l'utilisateur soit authentifié
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canLoad(route: Route): Observable<boolean> | boolean | Promise<boolean> {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  /**
   * @description Méthode de vérification de d'accès
   * @param url [[string]] redirection url
   */
  checkLogin(url: string): Observable<boolean> | boolean | Promise<boolean> {
    return this.authState$.pipe(
      filter(
        (state) =>
          !state.authenticating &&
          !(
            typeof state.isInitialState === "undefined" ||
            state?.isInitialState === null
          )
      ),
      map((source) => {
        if (source.isLoggedIn) {
          return true;
        }
        this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
        return false;
      }),
      takeUntil(this._destroy$)
    );
  }
  ngOnDestroy(): void {
    this._destroy$.next();
  }
}

@Injectable()
export class AuthorizationsGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.isAuthorized(next.data.authorizations, url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    return this.isAuthorized(route.data?.authorizations, url);
  }

  private isAuthorized(
    authorizations: string[] | string,
    url: string
  ): Observable<boolean> | boolean | Promise<boolean> {
    return this.auth.state$.pipe(
      filter(
        (state) =>
          !state.authenticating &&
          !(
            typeof state.isInitialState === "undefined" ||
            state?.isInitialState === null
          )
      ),
      map((source) => {
        if (typeof source.user === "undefined" || typeof source.user === null) {
          this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
          return false;
        }
        let isAuthorized = false;
        if (Array.isArray(authorizations)) {
          isAuthorized = userCanAny(
            source.user as Authorizable,
            authorizations
          );
        } else {
          isAuthorized = userCan(
            source.user as Authorizable,
            authorizations as string
          );
        }
        if (!isAuthorized) {
          // Navigate to the login page with extras
          this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
          return false;
        }
        return true;
      })
    );
  }
}
@Injectable()
export class RootComponentGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private authToken: AuthTokenService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.canLoadURL(next, url);
  }

  private canLoadURL(
    route: ActivatedRouteSnapshot,
    url: string
  ): Observable<boolean> {
    return this.auth.state$.pipe(
      filter(
        (state) =>
          !state.authenticating &&
          !(
            typeof state.isInitialState === "undefined" ||
            state?.isInitialState === null
          )
      ),
      map((source) => {
        if (typeof source.user === "undefined" || typeof source.user === null) {
          this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
          return false;
        }
        if (
          !userCanAny(
            source.user as Authorizable,
            route.data.authorizations ?? []
          )
        ) {
          this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
          return false;
        }
        if (this.authToken.token) {
          this.router.navigate([url]);
        }
        return true;
      })
    );
  }
}
