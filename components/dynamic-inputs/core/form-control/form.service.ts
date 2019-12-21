import {
  AbstractRequestClient,
  IRequestClient
} from 'src/app/lib/domain/contracts/abstract-request-client';
import {
  HttpRequestService,
  IResponseBody,
  ResponseData,
  ResponseBody
} from 'src/app/lib/domain/http/core';
import { Form } from './form';
import { isDefined } from '../../../../utils/type-utils';
import { Injectable } from '@angular/core';
import { ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { SessionStorage } from 'src/app/lib/domain/storage/core';

@Injectable()
export class FormService extends AbstractRequestClient
  implements IRequestClient {

  private ressourcesPath: string;
  // private formId: number;

  /**
   * @description Service initializer
   */
  constructor(private client: HttpRequestService, private cache: SessionStorage) {
    super();
    this.ressourcesPath = 'ressources/forms';
  }

  /**
   * @description Get the form with the provided using the loaded form id
   */
  public async getForm(id: string|number): Promise<Form> {
    // Try getting the form from the cache
    const form = this.cache.get(`Form__${id}`);
    return new Promise((resolve, reject) => {
      // If the form is in the cache, generate the Form object from cache serialized value
      if (form) {
        resolve((Form.builder() as ISerializableBuilder<Form>).fromSerialized(form));
      } else {
        // Else query for the form from an http endpoint
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
      }
    });
  }

  private loadThroughHttpRequest(id: string|number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(this.client, `${this.ressourcesPath}/${id}`)
        .then((res: ResponseData) => {
          const body: IResponseBody = new ResponseBody(
            Object.assign(res.body, { status: res.code })
          );
          if (res.success === true) {
            if (isDefined(body.data)) {
              // Add the form to the session storage
              resolve(body.data);
            }
          }
          resolve(null);
        })
        .catch(err => reject(err));
    });
  }

  // /**
  //  * @description Set the form id to load from the from ressources provider
  //  * @param id [[number]]
  //  */
  // loadFormWithId(id: number): FormService {
  //   this.formId = id;
  //   return this;
  // }
}
