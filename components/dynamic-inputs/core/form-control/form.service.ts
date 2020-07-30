import {
  RequestClient,
  IRequestClient,
  HttpGetAllRequestFn
} from 'src/app/lib/domain/contracts/abstract-request-client';
import {
  HttpRequestService,
  IResponseBody,
  ResponseData,
  ResponseBody
} from 'src/app/lib/domain/http/core';
import { Form } from './form';
import { isDefined, isArray } from '../../../../utils';
import { Injectable } from '@angular/core';
import { ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { FormControl } from './form-control';
import { ISourceRequestQueryParameters, IDataSourceService, ISource } from '../../../ng-data-table/ng-data-table.component';
import { FormControlOptionsEntity } from './form-control-options-entity';
import { LocalStorage } from '../../../../storage/core/local-storage.service';

export class FormDataSource implements IDataSourceService<ISource<Form>> {

  public readonly ressourcesGetterMethod: HttpGetAllRequestFn;
  public readonly ressourcesPath: string;
  private client: HttpRequestService;
  public readonly formListEntryKey = 'Temp_Form_Lists_';
  // tslint:disable-next-line: variable-name
  private _queryParams: object;

  constructor(
    client: HttpRequestService,
    fn: HttpGetAllRequestFn,
    path: string,
    /* private cache: LocalStorage */
  ) {
    this.ressourcesGetterMethod = fn;
    this.ressourcesPath = path;
    this.client = client;
  }

  setQueryParameters(params: object) {
    this._queryParams = params;
    return this;
  }

  getItems(params: ISourceRequestQueryParameters): Promise<ISource<Form>> {
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
      // tslint:disable-next-line: max-line-length
      this.ressourcesGetterMethod(this.client, `${this.ressourcesPath}${query}`, { params: this._queryParams }).then(async (res: ResponseData) => {
        const body: IResponseBody = new ResponseBody(
          Object.assign(res.body, { status: res.code })
        );
        const forms = (res.success === true) ? (body.data.data as Array<any>).map((value) => {
          return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
        }) : [];
        resolve({
          data: forms,
          total: body.data.total
        });
      })
        .catch(err => reject(err));
    });
  }

}

@Injectable({
  providedIn: 'root'
})
export class FormService extends RequestClient
  implements IRequestClient {

  public readonly ressourcesPath: string;
  public readonly formControlRessourcesPath: string;
  public readonly formFormControlRessourcesPath: string;
  public readonly bindableEntitiesRessourcesPath: string;
  public readonly dataSource: IDataSourceService<ISource<Form>>;
  // private formId: number;

  /**
   * @description Service initializer
   */
  constructor(private client: HttpRequestService, public readonly cache: LocalStorage) {
    super();
    this.ressourcesPath = 'forms';
    this.formControlRessourcesPath = 'form_controls';
    this.formFormControlRessourcesPath = 'form_form_controls';
    this.bindableEntitiesRessourcesPath = 'form_control_option_models';
    this.dataSource = new FormDataSource(client, this.get, this.ressourcesPath);
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public async getForm(id: string | number): Promise<Form> {
    // Try getting the form from the cache
    // const form = this.cache.get(`Form__${id}`);
    return new Promise((resolve, reject) => {
      const result: Promise<any> = this.loadThroughHttpRequest(id);
      result.then((value: any) => {
        if (isDefined(value)) {
          // Add the loaded form from to the session storage
          this.cache.set(`Form__${id}`, value);
          resolve((Form.builder() as ISerializableBuilder<Form>).fromSerialized(value));
        } else {
          resolve(null);
        }
      });
      result.catch((err) => reject(err));
    });
  }

  /**
   * @description Get all forms from the data source
   */
  public async getForms() {
    return new Promise<Form[]>((resolve, reject) => {
      this.get(this.client, `${this.ressourcesPath}`)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true && isArray(body.data.data)) {
            const forms = (body.data.data as Array<object>).map((value) => {
              return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
            });
            resolve(forms);
          }
          resolve([]);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Get the list of tables or entities that can be associated with a selectable control input
   */
  public async getFormControlOptionsBindableEntities() {
    return new Promise<FormControlOptionsEntity[]>((resolve, reject) => {
      this.get(this.client, `${this.bindableEntitiesRessourcesPath}`)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true && isArray(body.data.data)) {
            const entities = (body.data.data as Array<object>).map((value) => {
              return (FormControlOptionsEntity.builder() as ISerializableBuilder<FormControlOptionsEntity>).fromSerialized(value);
            });
            resolve(entities);
          }
          resolve([]);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Try loading a form details from the cache or from the server
   * @param id [[number|string]]
   * @param params [[object]]
   */
  public async loadFormFromCacheOrGetFromServer(id: number | string, params?: object) {
    // Try getting the form from the cache
    let forms = this.cache.get((this.dataSource as FormDataSource).formListEntryKey);
    let form: Form;
    return new Promise<Form>((resolve, reject) => {
      // If the form is in the cache, generate the Form object from cache serialized value
      if (isArray(forms)) {
        forms = (forms as Array<any>).map((value) => {
          return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
        });
        form = (forms as Form[]).find((value) => {
          return value.id === id;
        });
      }
      if (isArray(form) && isDefined(form)) {
        resolve(form);
      } else {
        // Else query for the form from an http endpoint
        const result: Promise<any> = this.loadThroughHttpRequest(id, params);
        result.then((value: any) => {
          if (isDefined(value)) {
            // Add the loaded form from to the session storage
            // this.cache.set(`Form__${id}`, value);
            resolve((Form.builder() as ISerializableBuilder<Form>).fromSerialized(value));
          } else {
            resolve(null);
          }
        });
        result.catch((err) => reject(err));
      }
    });
  }

  private loadThroughHttpRequest(id: string | number, params: object = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(this.client, `${this.ressourcesPath}/${id}`, params)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true && isDefined(body.data)) {
            resolve(body.data);
          }
          resolve(null);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Create | add a new form to the forms database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  createForm(requestBody: object, endPointURL: string = null) {
    return new Promise<IResponseBody | Form>((resolve, reject) => {
      this.create(this.client, isDefined(endPointURL) ? endPointURL : this.ressourcesPath, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if ((res.success === true) && isDefined(body.data)) {
            // Add the form to the session storage
            const form = (Form.builder() as ISerializableBuilder<Form>).fromSerialized(body.data);
            this.cache.set(`Form__${form.id}`, body.data);
            resolve(form);
          } else {
            resolve(body);
          }
        })
        .catch(err => reject(err));
    });
  }


  /**
   * @description Handle form update action done by users
   * @param id [[number|string]]
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  updateForm(id: number | string, requestBody: object, endPointURL: string = null) {
    return new Promise<IResponseBody>((resolve, reject) => {
      this.update(this.client, `${isDefined(endPointURL) ? endPointURL : this.ressourcesPath}`, id, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true && isDefined(body.data)) {
            this.cache.delete(`Form__${id}`);
          }
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }

  // Handlers for form controls
  /**
   * @description Add a new form-control to the form-controls database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  createFormControl(requestBody: object, endPointURL: string = null) {
    return new Promise<IResponseBody | FormControl>((resolve, reject) => {
      this.create(this.client, isDefined(endPointURL) ? endPointURL : this.formControlRessourcesPath, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if ((res.success === true) && isDefined(body.data)) {
            // Add the form to the session storage
            const form = (FormControl.builder() as ISerializableBuilder<FormControl>).fromSerialized(body.data);
            resolve(form);
          } else {
            resolve(body);
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Add the required field to the application storage to associate a form with a
   * form-control alongs with the required attributes
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  createFormFormControlRelation(requestBody: object, endPointURL: string = null) {
    return new Promise<IResponseBody | Form>((resolve, reject) => {
      this.create(this.client, this.formFormControlRessourcesPath, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if ((res.success === true) && isDefined(body.data)) {
            // Add the form to the session storage
            const form = (Form.builder() as ISerializableBuilder<Form>).fromSerialized(body.data);
            this.cache.set(`Form__${form.id}`, body.data);
            resolve(form);
          } else {
            resolve(body);
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Update a form element A.K.A Form control, or FormFormControl relation using the provided id
   * @param endPointURL [[string]]
   * @param elementId [[number|string]]
   * @param requestBody [[object]]
   */
  updateFormElement(endPointURL: string, elementId: string | number, requestBody: object) {
    return new Promise<IResponseBody>((resolve, reject) => {
      this.update(this.client, endPointURL, elementId, requestBody)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Remove the form element with the specific id from the data source
   * @param endPointURL [[string]]
   * @param elementId [[number|string]]
   */
  deleteFormElement(endPointURL: string, elementId: string | number) {
    return new Promise<IResponseBody>((resolve, reject) => {
      this.delete(this.client, endPointURL, elementId)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          resolve(body);
        })
        .catch(err => reject(err));
    });
  }
}
