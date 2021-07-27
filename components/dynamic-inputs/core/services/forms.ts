
import { isDefined, isArray } from '../../../../utils';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FormV2 } from '../v2/models/form';
import { FormControlV2 } from '../v2/models';
import { DynamicFormControlInterface, DynamicFormInterface } from '../compact/types';
import { Observable } from 'rxjs';
import { getResponseDataFromHttpResponse } from '../../../../http/helpers/http-response';
import { DrewlabsRessourceServerClient } from '../../../../http/core/ressource-server-client';
import { LocalStorage } from '../../../../storage/core/local-storage.service';
import { IHttpResponse } from '../../../../http/contracts/types';
import { FORM_RESOURCES_PATH } from '../constants/injection-tokens';
import { httpServerHost } from '../../../../utils/url/url';

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
    public readonly cache: LocalStorage,
    @Inject(FORM_RESOURCES_PATH) path: string,
    @Inject('FORM_SERVER_HOST') host: string,
  ) {
    this.ressourcesPath = `${httpServerHost(host)}/${path}`
    this.formControlRessourcesPath = 'form-controls';
    this.formFormControlRessourcesPath = 'form-form-controls';
    this.bindableEntitiesRessourcesPath = 'form-control-options';
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public async getForm(id: string | number, params?: { [prop: string]: any }): Promise<DynamicFormInterface|undefined> {
    return this.client.get(`${this.ressourcesPath}/${id}`, { params }).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data)) ? (FormV2.builder()).fromSerialized(data) : undefined;
      })
    ).toPromise();
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public rxGetForm(id: string | number, params?: { [prop: string]: any }): Observable<DynamicFormInterface|undefined> {
    return this.client.get(`${this.ressourcesPath}/${id}`, params).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data)) ? (FormV2.builder()).fromSerialized(data) : undefined;
      })
    );
  }

  /**
   * @description Get all forms from the data source
   *
   * @deprecated <Use rxGetForm Implementation for better control on the form object>
   */
  public async getForms(params: { [prop: string]: any } = {}): Promise<DynamicFormInterface[]> {
    return this.client.get(`${this.ressourcesPath}`, { params }).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data) && isArray(data)) ? (data as { [prop: string]: any }[])
          .map((value) => {
            return (FormV2.builder()).fromSerialized(value);
          }) : [];
      })
    ).toPromise();
  }

  /**
   * @description Get all forms from the data source
   */
  public rxGetForms(params: { [prop: string]: any } = {}): Observable<DynamicFormInterface[]> {
    return this.client.get(`${this.ressourcesPath}`, { params }).pipe(
      map(state => {
        const data = getResponseDataFromHttpResponse(state);
        return (isDefined(data) && isArray(data)) ? (data as { [prop: string]: any }[])
          .map((value) => {
            return (FormV2.builder()).fromSerialized(value);
          }) : [];
      })
    );
  }

  /**
   * @deprecated <Use form action in combination with [FormsProvider] which offer reactive implementation using rx-js library>
   * @description Create | add a new form to the forms database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createForm(requestBody: object, endPointURL?: string): Promise<DynamicFormInterface | IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.create(endPointURL ? endPointURL : this.ressourcesPath, requestBody)
      .pipe(
        map(state => {
          const data = getResponseDataFromHttpResponse(state);
          return isDefined(data) ? (FormV2.builder()).fromSerialized(data) : state;
        })
      ).toPromise();
  }


  /**
   * @deprecated <Use form action in combination with [FormsProvider] which offer reactive implementation using rx-js library>
   *
   * @description Handle form update action done by users
   * @param id [[number|string]]
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  updateForm(id: number | string, requestBody: object, endPointURL?: string): Promise<IHttpResponse<any>> {
    // tslint:disable-next-line: deprecation
    return this.client.update(`${isDefined(endPointURL) ? endPointURL : this.ressourcesPath}`, id, requestBody)
      .pipe(
        map(state => state)
      ).toPromise();
  }

  // Handlers for form controls
  /**
   * @deprecated <Use form action in combination with [FormsProvider] which offer reactive implementation using rx-js library>
   *
   * @description Add a new form-control to the form-controls database
   * @param requestBody [[object]]
   * @param endPointURL [[string]]
   */
  // tslint:disable-next-line: deprecation
  createFormControl(requestBody: object, endPointURL?: string): Promise<IHttpResponse<any> | DynamicFormControlInterface> {
    return this.client.create(endPointURL ? endPointURL : this.formControlRessourcesPath, requestBody)
      .pipe(
        map(state => {
          const data = getResponseDataFromHttpResponse(state);
          return isDefined(data) ? (FormControlV2.builder()).fromSerialized(data) : state;
        })
      ).toPromise();
  }

  /**
   * @deprecated <Use form action in combination with [FormsProvider] which offer reactive implementation using rx-js library>
   *
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
   * @deprecated <Use form action in combination with [FormsProvider] which offer reactive implementation using rx-js library>
   *
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
