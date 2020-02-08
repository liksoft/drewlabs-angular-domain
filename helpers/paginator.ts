import { Injectable, OnDestroy } from '@angular/core';
import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../components/ng-data-table/ng-data-table.component';
import { HttpGetAllRequestFn, RequestClient } from '../contracts/abstract-request-client';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { HttpRequestService, ResponseData, IResponseBody, ResponseBody } from '../http/core';
import { SessionStorage } from '../storage/core';
import { isArray, isDefined } from '../utils/type-utils';

@Injectable()
export class GenericPaginatorDatasource<T> implements IDataSourceService<ISource<T>>, OnDestroy {

  // tslint:disable-next-line: variable-name
  private _getMethod: HttpGetAllRequestFn;
  // tslint:disable-next-line: variable-name
  private _ressourcePath: string;
  // tslint:disable-next-line: variable-name
  private _cacheKey: string;
  // tslint:disable-next-line: variable-name
  public _status: number;
  // tslint:disable-next-line: variable-name
  private _inlineQuery: string | string[];
  // tslint:disable-next-line: variable-name
  private _builder: ISerializableBuilder<T>;
  // tslint:disable-next-line: variable-name
  private _responseJsonKey: string;
  // tslint:disable-next-line: variable-name
  private _queryParams: object;

  constructor(
    public readonly client: HttpRequestService,
    private cache: SessionStorage
  ) {
    this._getMethod = new RequestClient().get;
    this.client = client;
  }

  /**
   * @description Set the status of the ressource to query
   * @param value [[number]]
   */
  setStatus(value: number) {
    this._status = value;
    return this;
  }

  /**
   * @description Set the builder of the returned json model
   * @param builder [[ISerializableBuilder]]
   */
  setBuider(builder: ISerializableBuilder<T>) {
    this._builder = builder;
    return this;
  }

  /**
   * @description Set the additionnal query parameters that will be applied when querying the ressource
   * @param value [[string]]
   */
  setInlineQuery(value: string | string[]) {
    this._inlineQuery = value;
    return this;
  }

  /**
   * @description Object that will be passed as params to the current request
   * @param params [[object]]
   */
  setQueryParameters(params: object) {
    this._queryParams = params;
    return this;
  }

  /**
   * @description Set the ressource path of the query that will be executed on the backend endpoint
   * @param value [[string]]
   */
  setRessourcePath(value: string) {
    this._ressourcePath = value;
    return this;
  }

  /**
   * Set the json key that holds the response data
   * @param key [[string]]
   */
  setResponseJsonKey(key: string) {
    this._responseJsonKey = key;
    return this;
  }

  getItems(params: ISourceRequestQueryParameters) {
    if (!isDefined(this._ressourcePath)) {
      throw new Error('Unspecified ressource path. Set ressource path before proceeding with the request');
    }
    // Return a promise of an Http Request
    return new Promise<ISource<T>>((resolve, reject) => {
      // Build request query parameters
      let query = `?page=${params.page ? params.page : 1}`;
      if (isDefined(params.perPage)) {
        query += `&per_page=${params.perPage}`;
      }
      if (isDefined(params.by)) {
        query += `&by=${params.by}&order=${params.order ? params.order : 'desc'}`;
      }
      if (isDefined(this._inlineQuery)) {
        query += `&${this._inlineQuery}`;
      }
      if (this._status) {
        query += `&status=${this._status}`;
      }
      this._getMethod(this.client, `${this._ressourcePath}${query}`, { params: this._queryParams }).then((res: ResponseData) => {
        const body: IResponseBody = new ResponseBody(
          Object.assign(res.body, { status: res.code })
        );
        let result = [];
        const responseData = isDefined(this._responseJsonKey) ? body.data[this._responseJsonKey] : body.data;
        if ((res.success === true) && isArray(responseData.data)) {
          result = isDefined(this._builder) ? (responseData.data as Array<any>).map((value) => {
            return this._builder.fromSerialized(value);
          }) : responseData.data;
        }
        resolve({
          data: result,
          total: responseData.total
        });
      })
        .catch(err => reject(err));
    });
  }

  /**
   * @description Reset request and response configurable variables
   */
  resetScope() {
    this._builder = null;
    this._inlineQuery = null;
    this._responseJsonKey = null;
    this._status = null;
    return this;
  }

  ngOnDestroy(): void {
    this.resetScope();
  }
}
