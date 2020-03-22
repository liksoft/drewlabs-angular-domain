import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../../../components/ng-data-table/ng-data-table.component';
import { HttpGetAllRequestFn, RequestClient, IRequestClient } from '../../../contracts/abstract-request-client';
import { HttpRequestService } from '../../../http/core';
import { isDefined } from '../../../utils/type-utils';
import { ResponseData, IResponseBody, ResponseBody } from '../../../http/contracts/http-response-data';
import { Injectable } from '@angular/core';
import { SessionStorage } from '../../../storage/core';
import { Store } from '../../../store';
import { ISerializableBuilder } from '../../../built-value/contracts/serializers';
import { Permission, PermissionBuilder } from '../../models/permission';
import { PERMISSIONS_STORE, PERMISSIONS_CONTAINERINITIALIZED_ACTION, PERMISSION_CREATED_ACTION, PERMISSION_REMOVED_ACTION } from './reducers/permissions-reducer';

class PermissionsDataSource implements IDataSourceService<ISource<Permission>> {

  private ressourcesGetterMethod: HttpGetAllRequestFn;
  private ressourcesPath: string;
  private client: HttpRequestService;

  constructor(client: HttpRequestService, fn: HttpGetAllRequestFn, path: string) {
    this.ressourcesGetterMethod = fn;
    this.ressourcesPath = path;
    this.client = client;
  }
  getItems(params: ISourceRequestQueryParameters): Promise<ISource<Permission>> {
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
        const permissions = (res.success === true) ? (body.data.permissions.data as Array<any>).map((value) => {
          return (new PermissionBuilder()).fromSerialized(value);
        }) : [];
        resolve({
          data: permissions,
          total: body.data.permissions.total
        });
      })
        .catch(err => reject(err));
    });
  }

}

@Injectable()
export class PermissionsService extends RequestClient
  implements IRequestClient {

  public ressourcesPath: string;
  public readonly dataSource: IDataSourceService<ISource<Permission>>;
  private permissionsStorageKey: string;

  /**
   * @description Service initializer
   */
  constructor(
    private client: HttpRequestService,
    private cache: SessionStorage,
    private store: Store<Permission>,
  ) {
    super();
    this.ressourcesPath = 'permissions';
    this.permissionsStorageKey = 'Application_permissions_';
    this.dataSource = new PermissionsDataSource(client, this.get, this.ressourcesPath);
  }

  private loadPermissionsFromAPI() {
    return new Promise<any[]>((resolve, reject) => {
      this.get(this.client, this.ressourcesPath)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true && (body.data.permissions.data instanceof Array)) {
            resolve(body.data.permissions.data);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Register to organisation banks store value changes
   */
  public registerToStoreEvent() {
    this.store.get(PERMISSIONS_STORE).values().subscribe((values) => {
      if (isDefined(values)) {
        this.cache.set(this.permissionsStorageKey,
          values.toArray().map((value) => (Permission.builder() as ISerializableBuilder<Permission>).toSerialized(value)));
      }
    });
    return this;
  }

  /**
   * @description Get a role based on it unique identifier
   * @param id [[number|string]]
   */
  public getPermission(id: number | string) {
    return new Promise<Permission>((resolve, _) => {
      this.store.get(PERMISSIONS_STORE).values().subscribe((values) => {
        if (values) {
          resolve(values.get(values.findIndex((value: Permission) => +value.id === +id)));
        }
      });
    });
  }

  public getPermissions(): Promise<any> {
    return new Promise(async (_, __) => {
      const result = await this.loadPermissionsFromAPI();
      if (isDefined(result)) {
        this.store.dispatch({
          type: PERMISSIONS_CONTAINERINITIALIZED_ACTION,
          payload: {
            value: (result as Array<object>).map((value) => {
              return (Permission.builder() as ISerializableBuilder<Permission>).fromSerialized(value);
            })
          }
        });
      }
      _();
    });
  }

  public postPermission(requestURL: string, requestBody: object | string): Promise<IResponseBody> {
    return new Promise((resolve, reject) => {
      this.create(this.client, `${requestURL}`, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            if (body.data) {
              this.store.dispatch({
                type: PERMISSION_CREATED_ACTION,
                payload: {
                  value: (Permission.builder() as ISerializableBuilder<Permission>).fromSerialized(body.data)
                }
              });
            }
          }
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @inheritdoc
   */
  deletePermission(id: any): Promise<IResponseBody> {
    return new Promise((resolve, reject) => {
      this.delete(this.client, this.ressourcesPath, id)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            this.store.dispatch({
              type: PERMISSION_REMOVED_ACTION,
              payload: {
                index: 'id',
                needle: id
              }
            });
          }
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @inheritdoc
   */
  updatePermission(id: any, values: any): Promise<IResponseBody> {
    // The update mechanisme must be provided later
    return new Promise((resolve, reject) => {
      this.update(this.client, this.ressourcesPath, id, values)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            // Dispath update action
          }
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }
}
