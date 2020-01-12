import { AuthUserService } from './user.service';
import { Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { isDefined } from '../../utils/type-utils';
import { AuthTokenService } from '../../auth-token/core/auth-token.service';

/**
 * @description Authentication guard
 */
@Injectable()
export class AuthGuardService
  implements CanActivate, CanActivateChild, CanLoad {
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
  ): boolean {
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
  ): boolean {
    return this.canActivate(route, state);
  }

  /**
   * @description CanActivate guard appliqué aux module dont le chargement requiert que l'utilisateur soit authentifié
   * @param route [[ActivatedRouteSnapshot]] instance
   * @param state [[RouterStateSnapshot]] instance
   */
  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  /**
   * @description Méthode de vérification de d'accès
   * @param url [[string]] redirection url
   */
  checkLogin(url: string): boolean {
    if (this.auth.loggedIn) {
      return true;
    }

    if (this.auth.user) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.auth.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate([AuthPathConfig.REDIRECT_PATH]);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: AuthUserService
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
    return new Promise<boolean>((resolve, reject) => {
      const user = this.auth.user;
      let isAuthorized = false;
      if (isDefined(user)) {
        if (permissions && permissions instanceof Array) {
          isAuthorized = this.userService.hasPermissionIn(user, permissions);
        } else {
          isAuthorized = this.userService.hasPermission(
            user,
            permissions as string
          );
        }
      }
      if (isAuthorized) {
        resolve(true);
      } else {
        if (url) {
          this.auth.redirectUrl = url;
        } else {
          this.auth.redirectUrl = AuthPathConfig.REDIRECT_PATH;
        }
        // Navigate to the login page with extras
        this.router.navigate([this.auth.redirectUrl]);
        resolve(false);
      }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
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
    return this.canLoadURL(url);
  }

  private canLoadURL(url: string): boolean {
    if (isDefined(this.authToken.token) && isDefined(this.auth.user)) {
      this.router.navigate([url]);
    }
    return true;
  }
}
