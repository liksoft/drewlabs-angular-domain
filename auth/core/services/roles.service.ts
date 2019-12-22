import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../../../components/ng-data-table/ng-data-table.component';
import { HttpGetAllRequestFn,
  RequestClient,
  IRequestClient,
  loadThroughHttpRequest,
  putRessourceAndNotifyStore,
  postRessourceAndNotifiStore,
  deleteRessourceAndNotifyStore,
  getRessourcesAndNotify
} from '../../../contracts/abstract-request-client';
import { HttpRequestService } from '../../../http/core';
import { isDefined, isArray } from '../../../utils/type-utils';
import { ResponseData, IResponseBody, ResponseBody } from '../../../http/contracts/http-response-data';
import { Injectable } from '@angular/core';
import { SessionStorage } from '../../../storage/core';
import { Store } from '../../../store';
import { ISerializableBuilder } from '../../../built-value/contracts/serializers';
import { Role, RoleBuilder } from '../../models/role';
import {ROLES_CONTAINERINITIALIZED_ACTION, ROLE_CREATED_ACTION, ROLE_REMOVED_ACTION, ROLE_UPDATED_ACTION } from './reducers/roles-reducer';

class RolesDataSource implements IDataSourceService<ISource<Role>> {

  private ressourcesGetterMethod: HttpGetAllRequestFn;
  private ressourcesPath: string;
  private client: HttpRequestService;
  public readonly rolesStorageKey: string;

  constructor(client: HttpRequestService, fn: HttpGetAllRequestFn, path: string, private cache: SessionStorage) {
    this.ressourcesGetterMethod = fn;
    this.ressourcesPath = path;
    this.client = client;
    this.rolesStorageKey = 'Application_roles_';
  }
  getItems(params: ISourceRequestQueryParameters): Promise<ISource<Role>> {
    // Return a promise of an Http Request
    return new Promise((resolve, reject) => {
      // Build request query parameters
      let query = `?page=${params.page ? params.page : 1}`;
      if (isDefined(params.perPage)) {
        query += `&per_page=${params.perPage}`;
      }
      if (isDefined(params.by)) {
        query += `&by=${params.by}&order=${params.order ? params.order : 'desc'}`;
      }
      this.ressourcesGetterMethod(this.client, `${this.ressourcesPath}${query}`).then((res: ResponseData) => {
        const body: IResponseBody = new ResponseBody(
          Object.assign(res.body, { status: res.code })
        );
        const roles = (res.success === true) ? (body.data.roles.data as Array<any>).map((value) => {
          return (new RoleBuilder()).fromSerialized(value);
        }) : [];
        if (isArray(roles) && roles.length > 0) {
          this.cache.set(`${this.rolesStorageKey}`, roles.map((r) => {
            return (Role.builder() as ISerializableBuilder<Role>).toSerialized(r);
          }));
        }
        resolve({
          data: roles,
          total: body.data.roles.total
        });
      })
        .catch(err => reject(err));
    });
  }

}

@Injectable()
export class Roleservice extends RequestClient
  implements IRequestClient {

  public ressourcesPath: string;
  public readonly dataSource: IDataSourceService<ISource<Role>>;

  /**
   * @description Service initializer
   */
  constructor(
    private client: HttpRequestService,
    private cache: SessionStorage,
    public readonly store: Store<Role>,
  ) {
    super();
    this.ressourcesPath = 'roles';
    this.dataSource = new RolesDataSource(client, this.get, this.ressourcesPath, this.cache);
  }

  /**
   * @description Get a role based on it unique identifier
   * @param id [[number|string]]
   */
  public getRole(id: number | string) {
    // Try getting the role from the cache
    let roles = this.cache.get((this.dataSource as RolesDataSource).rolesStorageKey);
    return new Promise<Role>((resolve, reject) => {
      if (isDefined(roles) && isArray(roles)) {
        // If the form is in the cache, generate the Form object from cache serialized value
        roles = (roles as Array<any>).map((value) => {
          return (Role.builder() as ISerializableBuilder<Role>).fromSerialized(value);
        });
        const role = (roles as Role[]).find((value) => {
          return +value.id === +id;
        });
        resolve(role);
      } else {
        // Else query for the role from an http endpoint
        const result: Promise<any> = loadThroughHttpRequest(this.client, this.ressourcesPath, id);
        result.then((value: any) => {
          if (isDefined(value)) {
            // Add the loaded role from to the session storage
            resolve((Role.builder() as ISerializableBuilder<Role>).fromSerialized(value));
          } else {
            resolve(null);
          }
        });
        result.catch((err) => reject(err));
      }
    });
  }

  public getRoles(): Promise<any> {
    return getRessourcesAndNotify<Role>(
      this.client,
      this.ressourcesPath,
      Role.builder() as ISerializableBuilder<Role>,
      this.store,
      ROLES_CONTAINERINITIALIZED_ACTION,
      'roles'
    );
  }

  public postRole(requestURL: string, requestBody: object) {
    return postRessourceAndNotifiStore<Role>(
      this.client,
      `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`,
      requestBody,
      Role.builder() as ISerializableBuilder<Role>,
      this.store,
      ROLE_CREATED_ACTION
    );
  }

  /**
   * @inheritdoc
   */
  deleteRole(id: any) {
    return deleteRessourceAndNotifyStore<Role>(
      this.client,
      this.ressourcesPath,
      id,
      this.store,
      ROLE_REMOVED_ACTION,
      'id'
    );
  }

  /**
   * @inheritdoc
   */
  updateRole(requestURL: string, id: any, values: any): Promise<IResponseBody> {
    return putRessourceAndNotifyStore<Role>(
      this.client,
      `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`,
      id,
      values,
      {},
      this.store,
      ROLE_UPDATED_ACTION,
      'id'
    );
  }
}
