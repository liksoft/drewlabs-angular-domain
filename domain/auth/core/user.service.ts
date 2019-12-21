import { IUserManager } from './../contracts/user-manager';
import { Injectable } from '@angular/core';
import { AuthUser, Role, IPermission } from '../contracts';
import { Observable } from 'rxjs';
import { AuthServerPathConfig, ServerResponseKeys } from './config';
import { HttpRequestService } from '../../http/core/http-request.service';
import { ResponseData } from '../../http/core';

export interface PasswordResetBody {
  password: string;
  password_confirmation: string;
}

/**
 * @description Service de Gestion d'utilisateurs
 */
@Injectable()
export class AuthUserService implements IUserManager {
  /**
   * @param httpService [[HttpRequestService]] instance
   */
  constructor(private httpService: HttpRequestService) {}

  // /**
  //  * @description Authenticate a user
  //  * @param userSecret Secret of the user being connecting to the application
  //  * @param identifier Identifier of the user attempting connexion
  //  */
  // public authenticate(password: string, username: string) {
  //   return ;
  // }

  /**
   * Handler for user creation action
   * @param userDetails [[object]]
   */
  public createUser(userDetails: object): Promise<any> | Observable<any> {
    return this.httpService.post(
      AuthServerPathConfig.USER_CRUD_PATH,
      userDetails,
      this.httpService.defaultHttpHeaders()
    );
  }

  public updateUser(userId: number|string, values: object): Promise<any> | Observable<any>  {
    return this.httpService.put(
      `${AuthServerPathConfig.USER_CRUD_PATH}/${userId}`,
      values,
      this.httpService.defaultHttpHeaders()
    );
  }

  public updateUserPassword(values: PasswordResetBody): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.put(
        `${AuthServerPathConfig.PASSWORD_RESET_PATH}`,
        values,
        this.httpService.defaultHttpHeaders()
      ).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  /**
   * @description Checks if a user has a given role
   * @param user Application user instance
   * @param role Role label assignable to an application user
   */
  hasRole(user: AuthUser, role: string): boolean {
    if (user.roles) {
      const found = user.roles.find((element: Role) => {
        return element.label.toString() === role.toString();
      });
      if (found) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * @description Checks if a user has a given permission
   * @param user Application user instance
   * @param permission permission label
   */
  hasPermission(user: AuthUser, permission: string): boolean {
    if (user.permissions) {
      const found = user.permissions.filter((el: IPermission) => {
        return el.label.toString() === permission;
      });
      if (found.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * @description Checks if a user has a given permission in a set of permissions
   * @param user Application user instance
   * @param permissions list of permission labels
   */
  hasPermissionIn(user: AuthUser, permissions: string[]): boolean {
    if (permissions && permissions.length > 0) {
      let found = false;
      for (const i of permissions) {
        if (this.hasPermission(user, i)) {
          found = true;
          break;
        }
      }
      return found;
    }
    return true;
  }
}
