import { IAppUser } from './user';

export interface IUserStorageHandler {

  /**
   * @description Add authenticated user to the application expirable storage
   */
  addUserToCache(params: IAppUser): void;

  /**
   * @description Load previously added authenticated user
   */
  getUserFromCache(): IAppUser;


  /**
   * @description Delete connection/authenticated user from the client storage(s)
   */
  removeUserFromCache(): void;

}
