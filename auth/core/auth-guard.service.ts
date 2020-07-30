import { Injectable, OnDestroy } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  Route
} from '@angular/router';
import { AuthService } from './auth.service';
import { AuthPathConfig } from './config';
import { Observable, of } from 'rxjs';
import { isDefined } from '../../utils/types/type-utils';
import { AuthTokenService } from '../../auth-token/core/auth-token.service';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { userCanAny, Authorizable, userCan } from '../contracts/v2/user/user';
import { createSubject } from '../../rxjs/helpers/index';

/**
 * @description Authentication guard
 */
@Injectable()
export class AuthGuardService
  implements CanActivate, CanActivateChild, CanLoad, OnDestroy {

  private authState$ = this.auth.state$;
  // tslint:disable-next-line: variable-name
  private _destroy$ = createSubject();

  constructor(private router: Router, private auth: AuthService) { }

  /**
   * @description Handle for component instance activation.
   * Check if user is authenticated before authorizing access to the current component
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
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
  ) {
    return this.canActivate(route, state);
  }

  /**
   * @description CanActivate guard appliqué aux module dont le chargement requiert que l'utilisateur soit authentifié
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canLoad(route: Route) {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  /**
   * @description Méthode de vérification de d'accès
   * @param url [[string]] redirection url
   */
  checkLogin(url: string) {
    return this.authState$
      .pipe(
        takeUntil(this._destroy$),
        mergeMap(source => {
          if (!isDefined(source.user) || !isDefined(source.isLoggedIn)) {
            this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
            return of(false);
          }
          return of(true);
        }),
      );
  }
  ngOnDestroy() {
    this._destroy$.next();
  }
}

@Injectable()
export class PermissionsGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkPermission(next.data.permissions, url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    return this.checkPermission(route.data.permissions, url);
  }

  private checkPermission(permissions: string[] | string, url: string) {
    return this.auth.state$
      .pipe(
        mergeMap(source => {
          if (!isDefined(source.user)) {
            this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
            return of(false);
          }
          let isAuthorized = false;
          if (permissions && permissions instanceof Array) {
            isAuthorized = (userCanAny(source.user as Authorizable, permissions));
          } else {
            isAuthorized = (userCan(source.user as Authorizable, permissions as string));
          }
          if (!isAuthorized) {
            // Navigate to the login page with extras
            this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
            return of(false);
          }
          return of(true);
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
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.canLoadURL(next, url);
  }

  private canLoadURL(route: ActivatedRouteSnapshot, url: string): Observable<boolean> {
    return this.auth.state$
      .pipe(
        mergeMap(source => {
          if (!isDefined(source.user)) {
            this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
            return of(false);
          }
          if (isDefined(route.data.modulePermissions)
            && !(userCanAny(source.user as Authorizable, route.data.modulePermissions))) {
            this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
            return of(false);
          }
          if (isDefined(this.authToken.token)) {
            this.router.navigate([url]);
          }
          return of(true);
        })
      );
  }
}
