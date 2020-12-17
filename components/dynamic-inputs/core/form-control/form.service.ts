import {
  DrewlabsRessourceServerClient
} from '../../../../http/core';
import { isDefined, isArray } from '../../../../utils';
import { Injectable } from '@angular/core';
import { ISerializableBuilder } from '../../../../built-value/contracts/serializers';
import { FormControl } from './form-control';
import { FormControlOptionsEntity } from './form-control-options-entity';
import { LocalStorage } from '../../../../storage/core/local-storage.service';
import { getResponseDataFromHttpResponse } from '../../../../http/helpers/http-response';
import { map } from 'rxjs/operators';
import { FormV2 } from '../v2/models/form';
import { FormControlV2 } from '../v2/models';
import { DynamicFormInterface } from '../compact/types';
import { IHttpResponse } from '../../../../http/contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public readonly ressourcesPath: string;
  public readonly formControlRessourcesPath: string;
  public readonly formFormControlRessourcesPath: string;
  public readonly bindableEntitiesRessourcesPath: string;

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
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public async getForm(id: string | number, params?: { [prop: string]: any }): Promise<DynamicFormInterface> {
    return this.client.get(`${this.ressourcesPath}/${id}`, { params }).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data)) ? (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(data) : null;
      })
    ).toPromise();
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public rxGetForm(id: string | number, params?: { [prop: string]: any }): Observable<DynamicFormInterface> {
    return this.client.get(`${this.ressourcesPath}/${id}`, params).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data)) ? (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(data) : null;
      })
    );
  }

  /**
   * @description Get all forms from the data source
   */
  public async getForms(params: {[prop: string]: any} = {}): Promise<DynamicFormInterface[]> {
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
   * @description Get all forms from the data source
   */
  public rxGetForms(params: {[prop: string]: any} = {}): Observable<DynamicFormInterface[]> {
    return this.client.get(`${this.ressourcesPath}`, {params}).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data) && isArray(data)) ? (data as { [prop: string]: any }[])
          .map((value) => {
            return (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(value);
          }) : [];
      })
    );
  }

  /**
   * @description Get the list of tables or entities that can be associated with a selectable control input
   */
  public async getFormControlOptionsBindableEntities(): Promise<FormControlOptionsEntity[]> {
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
    return this.getForm(id, params);
  }

  /**
   * @description Create | add a new form to the forms database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createForm(requestBody: object, endPointURL: string = null): Promise<DynamicFormInterface | IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.create(isDefined(endPointURL) ? endPointURL : this.ressourcesPath, requestBody)
      .pipe(
        map(state => {
          const data = getResponseDataFromHttpResponse(state);
          return isDefined(data) ? (FormV2.builder() as ISerializableBuilder<FormV2>).fromSerialized(data) : state;
        })
      ).toPromise();
  }


  /**
   * @description Handle form update action done by users
   * @param id [[number|string]]
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  updateForm(id: number | string, requestBody: object, endPointURL: string = null): Promise<IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.update(`${isDefined(endPointURL) ? endPointURL : this.ressourcesPath}`, id, requestBody)
      .pipe(
        map(state => state)
      ).toPromise();
  }

  // Handlers for form controls
  /**
   * @description Add a new form-control to the form-controls database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createFormControl(requestBody: object, endPointURL: string = null): Promise<IHttpResponse<any> | FormControl | FormControlV2> {
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
  updateFormControl(endPointURL: string, elementId: string | number, requestBody: object): Promise<IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.update(endPointURL, elementId, requestBody)
      .pipe(
        map(state => state)
      ).toPromise();
  }

  /**
   * @description Remove the form element with the specific id from the data source
   * @param endPointURL [[string]]
   * @param elementId [[number|string]]
   */
  // tslint:disable-next-line: deprecation
  deleteFormElement(endPointURL: string, elementId: string | number): Promise<IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.update(endPointURL, elementId)
      .pipe(
        map(state => state)
      ).toPromise();
  }
}
