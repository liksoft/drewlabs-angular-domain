import { Observable } from 'rxjs';
import { AuthUser } from './user';

/**
 * @deprecated
 */
export interface IUserManager {

  // authenticate(userSecret: string, identifier: string): Promise<any> | Observable<any>;
  /**
   * Handler for user creation action
   * @param userDetails [[object]]
   */
  createUser(userDetails: object): Promise<any> | Observable<any>;

  /**
   * Handler for application user update
   * @param userId User identifier
   * @param values [[object]] request body
   */
  updateUser(userId: number|string, values: object): Promise<any> | Observable<any>;

  /**
   * @description Checks if a user has a given role
   * @param user Application user instance
   * @param role Role label assignable to an application user
   */
  // tslint:disable-next-line: deprecation
  hasRole(user: AuthUser, role: any): boolean;
}
