import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../../../components/ng-data-table/ng-data-table.component';
import { HttpGetAllRequestFn, RequestClient, IRequestClient, loadThroughHttpRequest } from '../../../contracts/abstract-request-client';
import { HttpRequestService } from '../../../http/core';
import { isDefined, isArray } from '../../../utils/type-utils';
import { ResponseData, IResponseBody, ResponseBody } from '../../../http/contracts/http-response-data';
import { Injectable } from '@angular/core';
import { SessionStorage } from '../../../storage/core';
import { Store } from '../../../store';
import { ISerializableBuilder } from '../../../built-value/contracts/serializers';
import { Department, DepartmentBuilder } from '../../models/department';
import {
  DEPARTMENT_CONTAINERINITIALIZED_ACTION,
  DEPARTMENT_REMOVED_ACTION, DEPARTMENT_CREATED_ACTION
} from './reducers/department-reducer';

class DepartmentsDataSource implements IDataSourceService<ISource<Department>> {

  private ressourcesGetterMethod: HttpGetAllRequestFn;
  private ressourcesPath: string;
  private client: HttpRequestService;
  public readonly departmentStorakey: string;

  constructor(client: HttpRequestService, fn: HttpGetAllRequestFn, path: string, private cache: SessionStorage) {
    this.ressourcesGetterMethod = fn;
    this.ressourcesPath = path;
    this.client = client;
    this.departmentStorakey = 'Departments_';
  }
  getItems(params: ISourceRequestQueryParameters): Promise<ISource<Department>> {
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
        const departments = (res.success === true) ? (body.data.departments.data as Array<any>).map((value) => {
          return (new DepartmentBuilder()).fromSerialized(value);
        }) : [];
        if (isArray(departments) && departments.length > 0) {
          this.cache.set(`${this.departmentStorakey}`, departments.map((r) => {
            return (Department.builder() as ISerializableBuilder<Department>).toSerialized(r);
          }));
        }
        resolve({
          data: departments,
          total: body.data.roles.total
        });
      })
        .catch(err => reject(err));
    });
  }

}

@Injectable()
export class Departmentservice extends RequestClient
  implements IRequestClient {

  public ressourcesPath: string;
  public readonly dataSource: IDataSourceService<ISource<Department>>;

  /**
   * @description Service initializer
   */
  constructor(
    private client: HttpRequestService,
    private cache: SessionStorage,
    public readonly store: Store<Department>,
  ) {
    super();
    this.ressourcesPath = 'departments';
    this.dataSource = new DepartmentsDataSource(client, this.get, this.ressourcesPath, this.cache);
  }

  /**
   * @description Get a role based on it unique identifier
   * @param id [[number|string]]
   */
  public getDepartment(id: number | string) {
    // Try getting the role from the cache
    let roles = this.cache.get((this.dataSource as DepartmentsDataSource).departmentStorakey);
    return new Promise<Department>((resolve, reject) => {
      if (isDefined(roles) && isArray(roles)) {
        // If the form is in the cache, generate the Form object from cache serialized value
        roles = (roles as Array<any>).map((value) => {
          return (Department.builder() as ISerializableBuilder<Department>).fromSerialized(value);
        });
        const role = (roles as Department[]).find((value) => {
          return +value.id === +id;
        });
        resolve(role);
      } else {
        // Else query for the role from an http endpoint
        const result: Promise<any> = loadThroughHttpRequest(this.client, this.ressourcesPath, id);
        result.then((value: any) => {
          if (isDefined(value)) {
            // Add the loaded role from to the session storage
            resolve((Department.builder() as ISerializableBuilder<Department>).fromSerialized(value));
          } else {
            resolve(null);
          }
        });
        result.catch((err) => reject(err));
      }
    });
  }

  public getDepartments(): Promise<any> {
    return new Promise(async (_, __) => {
      const result = await loadThroughHttpRequest(this.client, this.ressourcesPath);
      if (isDefined(result)) {
        this.store.dispatch({
          type: DEPARTMENT_CONTAINERINITIALIZED_ACTION,
          payload: {
            value: (result as Array<object>).map((value) => {
              return (Department.builder() as ISerializableBuilder<Department>).fromSerialized(value);
            })
          }
        });
      }
      _();
    });
  }

  public postDepartment(requestURL: string, requestBody: object | string): Promise<IResponseBody> {
    return new Promise((resolve, reject) => {
      this.create(this.client, `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            if (body.data) {
              this.store.dispatch({
                type: DEPARTMENT_CREATED_ACTION,
                payload: {
                  value: (Department.builder() as ISerializableBuilder<Department>).fromSerialized(body.data)
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
  deleteDepartment(id: any): Promise<IResponseBody> {
    return new Promise((resolve, reject) => {
      this.delete(this.client, this.ressourcesPath, id)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            this.store.dispatch({
              type: DEPARTMENT_REMOVED_ACTION,
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
  updateDepartment(requestURL: string, id: any, values: any): Promise<IResponseBody> {
    // The update mechanisme must be provided later
    return new Promise((resolve, reject) => {
      this.update(this.client, `${isDefined(requestURL) ? requestURL : this.ressourcesPath}`, id, values)
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
