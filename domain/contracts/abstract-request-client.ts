import {
  ResponseBody,
  ResponseData
} from 'src/app/lib/domain/http/contracts/http-response-data';
import { IEntity } from '../entity/entity-interface';
import { HttpRequestService } from 'src/app/lib/domain/http/core';
import { ServerResponseKeys } from 'src/app/lib/domain/auth/core';

/**
 * @description Get ressources/ request handler
 * @param ressourcePath [[string]]
 */
export type HttpGetAllRequestFn = (client: HttpRequestService, ressourcePath: string) => Promise<ResponseData>;

/**
 * @description GET ressources/{id} request handler
 * @param ressources Server ressource path
 * @param id Ressource identifier
 */
export type HttpGetRequestFn = (client: HttpRequestService, ressourcePath: string, id: number | any) => Promise<ResponseData>;

/**
 * @desciption POST ressources/ request handler
 * @param ressources Server ressource path
 * @param requestBody Request body as jsonInput
 */
export type HttpPostRequestFn = (client: HttpRequestService, ressources: string, requestBody: object | any) => Promise<ResponseData>;

/**
 * DELETE ressources/{id} request handler
 * @param ressources Server ressource path
 * @param id Ressource identifier
 */
export type HttpDeleteRequestFn = (client: HttpRequestService, ressources: string, id: number | any) => Promise<ResponseData>;

/**
 * PUT ressources/{id} request handler
 * @param ressources Server ressource path
 * @param id contact identifier
 */
// tslint:disable-next-line: max-line-length
export type HttpPutRequestFn = (client: HttpRequestService, ressources: string, id: number | any, values: object | any) => Promise<ResponseData>;

export interface IRequestClient {
  // /**
  //  * @description Get ressources/ request handler
  //  * @param ressources Server ressource path
  //  */
  // get(ressourcePath: string): Promise<ResponseData>;
  // /**
  //  * @description GET ressources/{id} request handler
  //  * @param ressources Server ressource path
  //  * @param id Ressource identifier
  //  */
  // getById(ressources: string, id: number | any): Promise<ResponseData>;
  // /**
  //  * @desciption POST ressources/ request handler
  //  * @param ressources Server ressource path
  //  * @param requestBody Object representing a contact
  //  */
  // create(ressources: string, requestBody: IEntity): Promise<ResponseData>;
  // /**
  //  * DELETE ressources/{id} request handler
  //  * @param ressources Server ressource path
  //  * @param id contact identifier
  //  */
  // delete(ressources: string, id: number | any): Promise<ResponseData>;
  // /**
  //  * PUT ressources/{id} request handler
  //  * @param ressources Server ressource path
  //  * @param id contact identifier
  //  */
  // update(
  //   ressources: string,
  //   id: number | any,
  //   updateValues: IEntity
  // ): Promise<ResponseData>;

  /**
   * @description Send and HTTP Request to an external ressources server using [[GET]] verb
   */
  get: HttpGetAllRequestFn;

  /**
   * @description Send and HTTP Request to an external ressources server using [[GET]] verb and passing the ressources identifier
   */
  getById: HttpGetRequestFn;

  /**
   * @description Send and HTTP Request to an external ressources server using [[POST]] verb
   */
  create: HttpPostRequestFn;

  /**
   * @description Send and HTTP Request to an external ressources server using [[DELETE]] verb
   */
  delete: HttpDeleteRequestFn;

  /**
   * @description Send and HTTP Request to an external ressources server using [[PUT]] verb
   */
  update: HttpPutRequestFn;
}

export class AbstractRequestClient implements IRequestClient {

  public get: HttpGetAllRequestFn = (client: HttpRequestService, ressources: string) => {
    return new Promise<ResponseData>((resolve, reject) => {
      client.get(ressources).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  public getById: HttpGetRequestFn = (client: HttpRequestService, ressources: string, id: any) => {
    return new Promise<ResponseData>((resolve, reject) => {
      client.get(`ressources/${id}`).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  public create: HttpPostRequestFn = (client: HttpRequestService, ressources: string, requestBody: object | string
  ) => {
    return new Promise<ResponseData>((resolve, reject) => {
      client.post(ressources, requestBody).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  public delete: HttpDeleteRequestFn = (client: HttpRequestService, ressources: string, id: any) => {
    return new Promise<ResponseData>((resolve, reject) => {
      client.delete(`${ressources}/${id}`).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  public update: HttpPutRequestFn = (client: HttpRequestService, ressources: string, id?: any, updateValues = {}
  ) => {
    return new Promise<ResponseData>((resolve, reject) => {
      ressources = id ? `${ressources}/${id}` : `${ressources}`;
      client.put(ressources, updateValues).subscribe(
        res => {
          // Handle the response object
          const responseData: ResponseData =
            res[ServerResponseKeys.RESPONSE_DATA];
          resolve(responseData);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
