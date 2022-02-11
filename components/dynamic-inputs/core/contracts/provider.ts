import { Observable } from "rxjs";
import { ActionHandler } from "../../../../../core/rxjs/handlers";
import { FormInterface } from "../../core/compact";
import { FormState, FormStoreActions } from "../../core/v2";

interface Provider {
  /**
   * @description Update a server form instance
   * @param url
   * @param body
   */
  update(url: string, body: { [index: string]: any }): Observable<any> | any;

  /**
   *
   * @param url
   * @param body
   */
  create(url: string, body: { [index: string]: any }): Observable<any> | any;

  /**
   * @description Update a server form control instance
   * @param url
   * @param body
   */
  updateControl(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | any;

  /**
   * @description Create a server form control instance
   * @param url
   * @param body
   */
  createControl(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | any;

  /**
   * @description Delete a server form control instance
   * @param url
   * @param id
   */
  deleteControl(
    url: string,
    id: number | string,
    form: number | string
  ): Observable<any> | any;

  /**
   * @description Get a list of server form instances
   * @param params
   * @param callback
   */
  getAll(
    params: { [index: string]: any },
    callback?: (value: any[]) => FormInterface[]
  ): Observable<{ [index: string]: any }[]>;

  /**
   * @description Query for a server form instance by id
   * @param id
   * @param params
   */
  get(
    id: string | number,
    params?: { [prop: string]: any }
  ): Observable<FormInterface>;

  /**
   * @description Makes a pagination request to the data source
   * @param url
   * @param params
   */
  paginate(
    url: string,
    params: { [index: string]: any }
  ): Observable<any> | any;
}
export interface CacheableProvider {
  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  cache(
    endpoint: string,
    options?: { [index: string]: any }
  ): Observable<never> | Observable<FormInterface[]>;
}

export type FormsProvider = Provider &
  ActionHandler<FormState, FormStoreActions> &
  CacheableProvider;
