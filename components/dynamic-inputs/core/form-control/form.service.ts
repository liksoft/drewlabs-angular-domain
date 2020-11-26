import {
  DrewlabsRessourceServerClient
} from 'src/app/lib/domain/http/core';
import { isDefined, isArray } from '../../../../utils';
import { Injectable } from '@angular/core';
import { ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { FormControl } from './form-control';
import { FormControlOptionsEntity } from './form-control-options-entity';
import { LocalStorage } from '../../../../storage/core/local-storage.service';
import { getResponseDataFromHttpResponse } from 'src/app/lib/domain/http/helpers/http-response';
import { map } from 'rxjs/operators';
import { FormV2 } from '../v2/models/form';
import { FormControlV2 } from '../v2/models';
import { DynamicFormInterface } from '../compact/types';

// export class FormDataSource implements IDataSourceService<ISource<Form>> {

//   public readonly ressourcesGetterMethod: HttpGetAllRequestFn;
//   public readonly ressourcesPath: string;
//   private client: HttpRequestService;
//   public readonly formListEntryKey = 'Temp_Form_Lists_';
//   // tslint:disable-next-line: variable-name
//   private _queryParams: object;

//   constructor(
//     client: HttpRequestService,
//     fn: HttpGetAllRequestFn,
//     path: string,
//     /* private cache: LocalStorage */
//   ) {
//     this.ressourcesGetterMethod = fn;
//     this.ressourcesPath = path;
//     this.client = client;
//   }

//   setQueryParameters(params: object) {
//     this._queryParams = params;
//     return this;
//   }

//   getItems(params: ISourceRequestQueryParameters): Promise<ISource<Form>> {
//     // Return a promise of an Http Request
//     return new Promise((resolve, reject) => {
//       // Build request query parameters
//       let query = `?page=${params.page ? params.page : 1}`;
//       if (isDefined(params.perPage)) {
//         query += `&per_page=${params.perPage}`;
//       }
//       if (isDefined(params.by)) {
//         query += `&by=${params.by}&order=${params.order ? params.order : 'desc'}`;
//       }
//       // tslint:disable-next-line: max-line-length
//       this.ressourcesGetterMethod(this.client, `${this.ressourcesPath}${query}`, { params: this._queryParams })
//         // tslint:disable-next-line: deprecation
//         .then(async (res: ResponseData) => {
//           // tslint:disable-next-line: deprecation
//           const body: IResponseBody = new ResponseBody(
//             Object.assign(res.body, { status: res.code })
//           );
//           const forms = (res.success === true) ? (body.data.data as Array<any>).map((value) => {
//             return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
//           }) : [];
//           resolve({
//             data: forms,
//             total: body.data.total
//           });
//         })
//         .catch(err => reject(err));
//     });
//   }

// }

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public readonly ressourcesPath: string;
  public readonly formControlRessourcesPath: string;
  public readonly formFormControlRessourcesPath: string;
  public readonly bindableEntitiesRessourcesPath: string;
  // public readonly dataSource: IDataSourceService<ISource<Form>>;
  // private formId: number;

  /**
   * @description Service initializer
   */
  constructor(
    private client: DrewlabsRessourceServerClient,
    public readonly cache: LocalStorage
  ) {
    this.ressourcesPath = 'forms';
    this.formControlRessourcesPath = 'form-controls';
    this.formFormControlRessourcesPath = 'form-form-controls';
    this.bindableEntitiesRessourcesPath = 'form-control-options';
    // this.dataSource = new FormDataSource(client, this.get, this.ressourcesPath);
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public async getForm(id: string | number, params?: { [prop: string]: any }): Promise<DynamicFormInterface> {
    // Try getting the form from the cache
    // const form = this.cache.get(`Form__${id}`);
    // return new Promise((resolve, reject) => {
    //   const result: Promise<any> = this.loadThroughHttpRequest(id);
    //   result.then((value: any) => {
    //     if (isDefined(value)) {
    //       // Add the loaded form from to the session storage
    //       // this.cache.set(`Form__${id}`, value);
    //       resolve((Form.builder() as ISerializableBuilder<Form>).fromSerialized(value));
    //     } else {
    //       resolve(null);
    //     }
    //   });
    //   result.catch((err) => reject(err));
    // });
    return this.client.get(`${this.ressourcesPath}/${id}`, params).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data)) ? (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(data) : null;
      })
    ).toPromise();
  }

  /**
   * @description Get all forms from the data source
   */
  public async getForms(params: {[prop: string]: any}): Promise<DynamicFormInterface[]> {
    // return new Promise<Form[]>((resolve, reject) => {
    //   // this.get(this.client, `${this.ressourcesPath}`)
    //   //   // tslint:disable-next-line: deprecation
    //   //   .then((res: ResponseData) => {
    //   //     // tslint:disable-next-line: deprecation
    //   //     const body: IResponseBody = new ResponseBody(
    //   //       Object.assign(res.body, { status: res.code })
    //   //     );
    //   //     if (res.success === true && isArray(body.data.data)) {
    //   //       const forms = (body.data.data as Array<object>).map((value) => {
    //   //         return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
    //   //       });
    //   //       resolve(forms);
    //   //     }
    //   //     resolve([]);
    //   //   })
    //   //   .catch(err => reject(err));
    // });
    return this.client.get(`${this.ressourcesPath}`, {params}).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data) && isArray(data)) ? (data as { [prop: string]: any }[])
          .map((value) => {
            return (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(value);
          }) : [];
      })
    ).toPromise();
  }

  /**
   * @description Get the list of tables or entities that can be associated with a selectable control input
   */
  public async getFormControlOptionsBindableEntities(): Promise<FormControlOptionsEntity[]> {
    // return new Promise<FormControlOptionsEntity[]>((resolve, reject) => {
    //   this.get(this.client, `${this.bindableEntitiesRessourcesPath}`)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       if (res.success === true && isArray(body.data.data)) {
    //         const entities = (body.data.data as Array<object>).map((value) => {
    //           return (FormControlOptionsEntity.builder() as ISerializableBuilder<FormControlOptionsEntity>).fromSerialized(value);
    //         });
    //         resolve(entities);
    //       }
    //       resolve([]);
    //     })
    //     .catch(err => reject(err));
    // });
    return this.client.get(`${this.bindableEntitiesRessourcesPath}`).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data) && isArray(data)) ? (data as { [prop: string]: any }[])
          .map((value) => {
            return (FormControlOptionsEntity.builder() as ISerializableBuilder<FormControlOptionsEntity>).fromSerialized(value);
          }) : [];
      })
    ).toPromise();
  }

  /**
   * @description Try loading a form details from the cache or from the server
   * @param id [[number|string]]
   * @param params [[object]]
   */
  public async loadFormFromCacheOrGetFromServer(id: number | string, params?: object): Promise<DynamicFormInterface> {
    // Try getting the form from the cache
    // let forms = this.cache.get((this.dataSource as FormDataSource).formListEntryKey);
    // let form: Form;
    // return new Promise<Form>((resolve, reject) => {
    // If the form is in the cache, generate the Form object from cache serialized value
    // if (isArray(forms)) {
    //   forms = (forms as Array<any>).map((value) => {
    //     return (Form.builder() as ISerializableBuilder<Form>).fromSerialized(value);
    //   });
    //   form = (forms as Form[]).find((value) => {
    //     return value.id === id;
    //   });
    // }
    // if (isArray(form) && isDefined(form)) {
    //   resolve(form);
    // } else {
    // Else query for the form from an http endpoint
    // const result: Promise<any> = this.loadThroughHttpRequest(id, params);
    // result.then((value: any) => {
    //   if (isDefined(value)) {
    //     resolve((Form.builder() as ISerializableBuilder<Form>).fromSerialized(value));
    //   } else {
    //     resolve(null);
    //   }
    // });
    // result.catch((err) => reject(err));
    // }
    // });
    return this.getForm(id, params);
  }

  // private loadThroughHttpRequest(id: string | number, params: object = {}): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.get(
  //       this.client,
  //       `${this.ressourcesPath}/${id}`,
  //       { params: params ? { ...params, load_bindings: true } : { load_bindings: true } })
  //       // tslint:disable-next-line: deprecation
  //       .then((res: ResponseData) => {
  //         // tslint:disable-next-line: deprecation
  //         const body: IResponseBody = new ResponseBody(
  //           Object.assign(res.body, { status: res.code })
  //         );
  //         const data = getResponseDataFromHttpResponse(body);
  //         if (res.success === true && isDefined(data)) {
  //           resolve(data);
  //         }
  //         resolve(null);
  //       })
  //       .catch(err => reject(err));
  //   });
  // }

  /**
   * @description Create | add a new form to the forms database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createForm(requestBody: object, endPointURL: string = null): Promise<DynamicFormInterface | any> {
    // tslint:disable-next-line: deprecation
    return this.client.create(isDefined(endPointURL) ? endPointURL : this.ressourcesPath, requestBody)
      .pipe(
        map(state => {
          const data = getResponseDataFromHttpResponse(state);
          return isDefined(data) ? (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(data) : state;
        })
      ).toPromise();
    // return new Promise<IResponseBody | Form>((resolve, reject) => {
    //   this.create(this.client, isDefined(endPointURL) ? endPointURL : this.ressourcesPath, requestBody)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       const data = getResponseDataFromHttpResponse(body);
    //       if ((res.success === true) && isDefined(data)) {
    //         // Add the form to the session storage
    //         const form = (Form.builder() as ISerializableBuilder<Form>).fromSerialized(data);
    //         this.cache.set(`Form__${form.id}`, data);
    //         resolve(form);
    //       } else {
    //         resolve(body);
    //       }
    //     })
    //     .catch(err => reject(err));
    // });
  }


  /**
   * @description Handle form update action done by users
   * @param id [[number|string]]
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  updateForm(id: number | string, requestBody: object, endPointURL: string = null): Promise<any> {
    // tslint:disable-next-line: deprecation
    return this.client.update(`${isDefined(endPointURL) ? endPointURL : this.ressourcesPath}`, id, requestBody)
      .pipe(
        map(state => state)
      ).toPromise();
    // return new Promise<IResponseBody>((resolve, reject) => {
    //   this.update(this.client, `${isDefined(endPointURL) ? endPointURL : this.ressourcesPath}`, id, requestBody)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       const data = getResponseDataFromHttpResponse(body);
    //       if (res.success === true && isDefined(data)) {
    //         this.cache.delete(`Form__${id}`);
    //       }
    //       resolve(body);
    //     })
    //     .catch(err => reject(err));
    // });
  }

  // Handlers for form controls
  /**
   * @description Add a new form-control to the form-controls database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createFormControl(requestBody: object, endPointURL: string = null): Promise<any | FormControl | FormControlV2> {
    // tslint:disable-next-line: deprecation
    // return new Promise<IResponseBody | FormControl>((resolve, reject) => {
    //   this.create(this.client, isDefined(endPointURL) ? endPointURL : this.formControlRessourcesPath, requestBody)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       const data = getResponseDataFromHttpResponse(body);
    //       if ((res.success === true) && isDefined(data)) {
    //         // Add the form to the session storage
    //         const form = (FormControl.builder() as ISerializableBuilder<FormControl>).fromSerialized(data);
    //         resolve(form);
    //       } else {
    //         resolve(body);
    //       }
    //     })
    //     .catch(err => reject(err));
    // });
    return this.client.create(isDefined(endPointURL) ? endPointURL : this.formControlRessourcesPath, requestBody)
      .pipe(
        map(state => {
          const data = getResponseDataFromHttpResponse(state);
          return isDefined(data) ? (FormControlV2.builder() as ISerializableBuilder<FormControlV2>).fromSerialized(data) : state;
        })
      ).toPromise();
  }

  /**
   * @param endPointURL [[string]]
   * @param elementId [[number|string]]
   * @param requestBody [[object]]
   */
  // tslint:disable-next-line: deprecation
  updateFormControl(endPointURL: string, elementId: string | number, requestBody: object): Promise<any> {
    // tslint:disable-next-line: deprecation
    return this.client.update(endPointURL, elementId, requestBody)
    .pipe(
      map(state => state)
    ).toPromise();
    // return new Promise<IResponseBody>((resolve, reject) => {
    //   this.update(this.client, endPointURL, elementId, requestBody)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       resolve(body);
    //     })
    //     .catch(err => reject(err));
    // });
  }

  /**
   * @description Remove the form element with the specific id from the data source
   * @param endPointURL [[string]]
   * @param elementId [[number|string]]
   */
  // tslint:disable-next-line: deprecation
  deleteFormElement(endPointURL: string, elementId: string | number): Promise<any> {
    // tslint:disable-next-line: deprecation
    return this.client.update(endPointURL, elementId)
    .pipe(
      map(state => state)
    ).toPromise();
    // return new Promise<IResponseBody>((resolve, reject) => {
    //   this.delete(this.client, endPointURL, elementId)
    //     // tslint:disable-next-line: deprecation
    //     .then((res: ResponseData) => {
    //       // tslint:disable-next-line: deprecation
    //       const body: IResponseBody = new ResponseBody(
    //         Object.assign(res.body, { status: res.code })
    //       );
    //       resolve(body);
    //     })
    //     .catch(err => reject(err));
    // });
  }
}
