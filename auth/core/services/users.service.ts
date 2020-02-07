import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../../../components/ng-data-table/ng-data-table.component';
import { User, UserBuilder, USER_SERIALIZABLE_BUILDER } from '../../models/user';
import {
  HttpGetAllRequestFn,
  IRequestClient,
  RequestClient,
  loadRessourceFromCacheOrGetFromServer,
  getRessources,
  postRessource,
  deleteRessource,
  putRessource
} from '../../../contracts/abstract-request-client';
import { HttpRequestService } from '../../../http/core';
import { isDefined, isArray } from '../../../utils/type-utils';
import { ResponseData, IResponseBody, ResponseBody } from '../../../http/contracts/http-response-data';
import { Injectable, Inject } from '@angular/core';
import { Store } from '../../../store';
import { ISerializableBuilder } from '../../../built-value/contracts/serializers';
import { SessionStorage } from '../../../storage/core/session-storage.service';

export class ApplicationUsersDataSource implements IDataSourceService<ISource<User>> {

  private ressourcesGetterMethod: HttpGetAllRequestFn;
  public ressourcesPath: string;
  private client: HttpRequestService;
  public readonly usersStorageKey: string;
  // tslint:disable-next-line: variable-name
  private _queryParams: object;

  constructor(client: HttpRequestService, fn: HttpGetAllRequestFn, path: string, private cache: SessionStorage) {
    this.ressourcesGetterMethod = fn;
    this.ressourcesPath = path;
    this.client = client;
    this.usersStorageKey = 'Application_Users_';
  }

  setQueryParameters(params: object) {
    this._queryParams = params;
    return this;
  }

  getItems(params: ISourceRequestQueryParameters) {
    // Return a promise of an Http Request
    return new Promise<ISource<User>>((resolve, reject) => {
      // Build request query parameters
      let query = `?page=${params.page ? params.page : 1}`;
      if (isDefined(params.perPage)) {
        query += `&per_page=${params.perPage}`;
      }
      if (isDefined(params.by)) {
        query += `&by=${params.by}&order=${params.order ? params.order : 'desc'}`;
      }
      // tslint:disable-next-line: max-line-length
      this.ressourcesGetterMethod(this.client, `${this.ressourcesPath}${query}`, { params: this._queryParams }).then((res: ResponseData) => {
        const body: IResponseBody = new ResponseBody(
          Object.assign(res.body, { status: res.code })
        );
        let users = [];
        if ((res.success === true) && isArray(body.data.users.data)) {
          this.cache.set(`${this.usersStorageKey}`, body.data.users.data);
          users = (body.data.users.data as Array<any>).map((value) => {
            return (new UserBuilder()).fromSerialized(value);
          });
        }
        resolve({
          data: users,
          total: body.data.users.total
        });
      })
        .catch(err => reject(err));
    });
  }

}

@Injectable()
export class ApplicationUsersService extends RequestClient
  implements IRequestClient {

  public readonly ressourcesPath: string = 'users';
  public readonly dataSource: IDataSourceService<ISource<User>>;

  /**
   * @description Service initializer
   */
  constructor(
    private client: HttpRequestService,
    private cache: SessionStorage,
    private store: Store<User>,
    @Inject(USER_SERIALIZABLE_BUILDER) private userBuilder: ISerializableBuilder<User>
  ) {
    super();
    this.dataSource = new ApplicationUsersDataSource(client, this.get, this.ressourcesPath, cache);
  }

  /**
   * @description Get a user based on it unique identifier
   * @param id [[number|string]]
   */
  public getUser(id: number | string) {
    return loadRessourceFromCacheOrGetFromServer(
      this.cache,
      this.client,
      this.ressourcesPath,
      id,
      (this.dataSource as ApplicationUsersDataSource).usersStorageKey,
      (User.builder() as ISerializableBuilder<User>)
    );
  }

  public getUsers(endpointURL?: string): Promise<User[]> {
    return getRessources<User>(
      this.client,
      `${isDefined(endpointURL) ? endpointURL : this.ressourcesPath}`,
      User.builder() as ISerializableBuilder<User>,
      'users'
    );
  }

  public postUser(requestURL: string, requestBody: object) {
    return postRessource<User>(
      this.client,
      `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`,
      requestBody,
      User.builder() as ISerializableBuilder<User>
    );
  }

  /**
   * @inheritdoc
   */
  deleteUser(id: any): Promise<IResponseBody> {
    return deleteRessource<User>(
      this.client,
      this.ressourcesPath,
      id,
    );
  }

  /**
   * @inheritdoc
   */
  updateUser(requestURL: string, id: any, values: object): Promise<IResponseBody> {
    return putRessource<User>(
      this.client,
      `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`,
      id,
      values,
    );
  }
}
