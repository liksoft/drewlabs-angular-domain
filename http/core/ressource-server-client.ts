import { Observable } from "rxjs";
import { Injectable, Inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { doLog } from "../../rxjs/operators";
import {
  Client,
  RequestBody,
  TransformResponseHandlerFn,
  IResourcesServerClient,
  IHttpResponse,
  ErrorHandler,
} from "../contracts";
import { UIStateStatusCode } from "../../ui-state";
import { isServerErrorResponse, isServerBadRequest } from "../helpers/response";
import { mapToHttpResponse } from "../rx";
import { HTTP_CLIENT } from "../tokens";

@Injectable()
export class DrewlabsRessourceServerClient
  implements IResourcesServerClient<IHttpResponse<any>>, ErrorHandler
{
  // #region Makes the default client visible to the user of the current service
  get httpClient() {
    return this._httpClient;
  }
  public errorState$ = this._httpClient.errorState$;
  // #endregion

  constructor(
    @Inject(HTTP_CLIENT) private _httpClient: Client & ErrorHandler,
    @Inject("ResponseTransformHandlerFn")
    private responseTransformHandler: TransformResponseHandlerFn
  ) {}

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  create(path: string, body: any, params?: object) {
    return this._httpClient
      .post(path, body, params)
      .pipe(
        doLog(`/POST ${path} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  get(path: string, params?: object) {
    return this._httpClient
      .get(path, params)
      .pipe(
        doLog(`/GET ${path} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  getUsingID(path: string, id: string | number, params?: object) {
    return this._httpClient
      .get(`${path}/${id}`, params)
      .pipe(
        doLog(`/GET ${path}/${id} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  update(path: string, body: any, params?: object) {
    return this._httpClient
      .put(path, body, params)
      .pipe(
        doLog(`/PUT ${path} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  updateUsingID(
    path: string,
    id: string | number,
    body: RequestBody,
    params?: object
  ) {
    return this._httpClient
      .put(`${path}/${id}`, body, params)
      .pipe(
        doLog(`/PUT ${path}/${id} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  delete(path: string, params: object) {
    return this._httpClient
      .delete(`${path}`, params)
      .pipe(
        doLog(`/DELETE ${path} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  deleteUsingID(path: string, id: string | number, params?: object) {
    return this._httpClient
      .delete(`${path}/${id}`, params)
      .pipe(
        doLog(`/DELETE ${path}/${id} - Request response: `),
        mapToHttpResponse<IHttpResponse<any>>(
          this.responseTransformHandler.bind(null)
        )
      ) as Observable<IHttpResponse<any>>;
  }

  /**
   * {@inheritdoc}
   */
  // tslint:disable-next-line: typedef
  handleErrorResponse(
    error: HttpErrorResponse
  ):
    | HttpErrorResponse
    | { status: UIStateStatusCode; validationErrors: { [prop: string]: any } } {
    const errorResponse = this.responseTransformHandler(error.error) as any;
    if (isServerBadRequest(error.status)) {
      const validationErrors: { [index: string]: any } = {};
      Object.keys(errorResponse.errors).forEach((key) => {
        validationErrors[key] = errorResponse.errors[key][0];
      });
      return {
        status: UIStateStatusCode.BAD,
        validationErrors,
      };
    }
    if (isServerErrorResponse(error.status)) {
      return {
        status: UIStateStatusCode.ERROR,
        validationErrors: {},
      };
    }
    return error;
  }

  handleError(error: HttpErrorResponse) {
    return this.handleErrorResponse(error);
  }
}
