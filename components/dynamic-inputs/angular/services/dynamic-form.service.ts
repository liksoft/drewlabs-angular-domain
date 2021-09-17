import { createStore, onErrorAction } from "../../../../rxjs/state/rx-state";
import { FormState } from "../../core/v2/actions";
import { formsReducer } from "../../core/v2/reducers";
import { Observable, throwError } from "rxjs";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import {
  createFormAction,
  createFormControlAction,
  deleteFormFormControl,
  onNewFormAction,
  updateFormAction,
  updateFormControlAction,
} from "../../core/v2/actions/form";
import { catchError, map, tap } from "rxjs/operators";
import { DynamicFormInterface } from "../../core/compact";
import { doLog } from "../../../../rxjs/operators";
import { DrewlabsRessourceServerClient } from "../../../../http/core";
import { getResponseDataFromHttpResponse } from "../../../../http/helpers";
import { FORM_RESOURCES_PATH } from "../../core/constants/injection-tokens";
import {
  DYNAMIC_FORM_LOADER,
  FormsLoaderInterface,
} from "./forms-loaders/types";
import { FormV2 } from "../../core/v2/models";
import { emptyObservable } from "src/app/lib/core/rxjs/helpers";

export const initialState: FormState = {
  collections: {
    currentPage: 1,
    total: 0,
    items: {},
    data: [],
  },
  performingAction: false,
};

export abstract class AbstractDynamicFormService {
  // Readonly store object
  public readonly store$ = createStore(formsReducer, initialState);

  // Http Client
  public readonly client: DrewlabsRessourceServerClient;

  get state$(): Observable<FormState> {
    return this.store$.connect();
  }

  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  abstract loadConfiguredForms(
    endpoint: string,
    options?: { [index: string]: any }
  ): Observable<never> | Observable<DynamicFormInterface[]>;

  abstract update(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | void;

  abstract create(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | void;

  abstract updateControl(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | void;

  abstract createControl(
    url: string,
    body: { [index: string]: any }
  ): Observable<any> | void;

  abstract deleteFormFormControl(
    url: string,
    controlID: number
  ): Observable<any> | void;

  abstract getAll(
    params: { [index: string]: any },
    callback?: (value: any[]) => DynamicFormInterface[]
  ): Observable<{ [index: string]: any }[]>;

  abstract get(
    id: string | number,
    params?: { [prop: string]: any }
  ): Observable<DynamicFormInterface>;
}

@Injectable()
export class DynamicFormService
  extends AbstractDynamicFormService
  implements OnDestroy
{
  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  loadConfiguredForms = (
    endpoint: string,
    options: { [index: string]: any } = {}
  ) => {
    return this.loader.load(endpoint, options).pipe(
      tap((state) => onNewFormAction(this.store$)(state)),
      doLog("DynamicFormService service: "),
      catchError((err) => {
        onErrorAction(this.store$)();
        return emptyObservable();
      })
    );
  };

  ngOnDestroy(): void {
    this.store$.destroy();
  }
  public readonly store$ = createStore(formsReducer, initialState);

  constructor(
    public readonly client: DrewlabsRessourceServerClient,
    @Inject(FORM_RESOURCES_PATH) private path: string,
    @Inject(DYNAMIC_FORM_LOADER) private loader: FormsLoaderInterface
  ) {
    super();
  }

  // tslint:disable-next-line: typedef
  get state$(): Observable<FormState> {
    return this.store$.connect();
  }

  update = (url: string, body: { [index: string]: any }) =>
    (() => {
      updateFormAction(this.store$)(this.client, url, body);
    })();

  create = (url: string, body: { [index: string]: any }) =>
    (() => {
      createFormAction(this.store$)(this.client, url, body);
    })();

  updateControl = (url: string, body: { [index: string]: any }) =>
    (() => {
      updateFormControlAction(this.store$)(this.client, url, body);
    })();

  createControl = (url: string, body: { [index: string]: any }) =>
    (() => {
      createFormControlAction(this.store$)(this.client, url, body);
    })();

  deleteFormFormControl = (url: string, controlID: number) =>
    (() => {
      deleteFormFormControl(this.store$)(url, {}, controlID);
    })();

  getAll = (
    params: { [index: string]: any },
    callback?: (value: any[]) => DynamicFormInterface[]
  ) =>
    (() =>
      this.client.get(this.path, { params }).pipe(
        map((state) => {
          const data = getResponseDataFromHttpResponse(state);
          return callback ? callback(data || []) : (data as any[]);
        }),
        catchError((err) => {
          onErrorAction(this.store$)(err);
          return throwError(err);
        })
      ))();

  /**
   * @description Get the form with the provided using the loaded form id
   */
  get = (id: string | number, params?: { [prop: string]: any }) => {
    return this.client.get(`${this.path}/${id}`, params).pipe(
      map((state) => {
        const data = getResponseDataFromHttpResponse(state);
        return data ? FormV2.builder().fromSerialized(data) : undefined;
      })
    );
  };
}
