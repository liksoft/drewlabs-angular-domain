import { Observable } from 'rxjs/Observable';
import { AuthUser } from './user';

export interface IUserManager {
  // /**
  //  * @description Authenticate a user
  //  * @param userSecret Secret of the user being connecting to the application
  //  * @param identifier Identifier of the user attempting connexion
  //  */
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
  hasRole(user: AuthUser, role: any): boolean;
}
