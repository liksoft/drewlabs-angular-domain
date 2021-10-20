import { createStore, onErrorAction } from "../../../../rxjs/state/rx-state";
import {
  FormState,
  FormStoreActions,
  onAddFormToStackAction,
  createFormAction,
  createFormControlAction,
  deleteFormFormControl,
  updateFormAction,
  updateFormControlAction,
  formCreatedAction,
  formUpdatedAction,
  formDeletedAction,
  formControlCreatedAction,
  formControlRemovedAction,
  formControlUpdatedAction,
  selectFormAction,
  onPaginateFormsAction,
} from "../../core/v2";
import { formsReducer } from "../../core/v2/reducers";
import { throwError } from "rxjs";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { DynamicFormInterface } from "../../core/compact";
import { doLog } from "../../../../rxjs/operators";
import { DrewlabsRessourceServerClient } from "../../../../http/core";
import { getResponseDataFromHttpResponse } from "../../../../http/helpers";
import { FORM_RESOURCES_PATH } from "../../core/constants/injection-tokens";
import { DYNAMIC_FORM_LOADER } from "./forms-loaders";
import { FormV2 } from "../../core/v2/models";
import { emptyObservable } from "src/app/lib/core/rxjs/helpers";
import { ActionResult } from "src/app/lib/core/rxjs/handlers";
import { FormsLoader, FormsProvider } from "../../core";

export const initialState: FormState = {
  collections: {
    page: 1,
    total: 0,
    items: {},
    data: [],
  },
  performingAction: false,
};

@Injectable()
export class DynamicFormService implements OnDestroy, FormsProvider {
  // Store instance
  public readonly store$ = createStore(formsReducer, initialState);

  // Provider state
  public state$ = this.store$?.connect();

  constructor(
    public readonly client: DrewlabsRessourceServerClient,
    @Inject(FORM_RESOURCES_PATH) private path: string,
    @Inject(DYNAMIC_FORM_LOADER) private loader: FormsLoader
  ) {}

  handle(
    action: FormStoreActions,
    payload: Partial<FormState>
  ): void | ActionResult<any> {
    switch (action) {
      case FormStoreActions.CREATE_RESULT_ACTION:
        formCreatedAction(this.store$)(payload);
        break;
      case FormStoreActions.NEW_VALUE_ACTION:
        onAddFormToStackAction(this.store$)(payload);
        break;
      case FormStoreActions.UPDATE_RESULT_ACTION:
        formUpdatedAction(this.store$)(payload);
        break;
      case FormStoreActions.DELETE_RESULT_ACTION:
        formDeletedAction(this.store$)(payload);
        break;
      case FormStoreActions.CONTROL_CREATE_RESULT_ACTION:
        formControlCreatedAction(this.store$)(payload);
        break;
      case FormStoreActions.CONTROL_UPDATE_RESULT_ACTION:
        formControlUpdatedAction(this.store$)(payload);
        break;
      case FormStoreActions.CONTROL_DELETE_RESULT_ACTION:
        formControlRemovedAction(this.store$)(payload);
        break;
      case FormStoreActions.FORM_SELECTED_ACTION:
        selectFormAction(this.store$)(payload);
        break;
      default:
        return;
    }
  }

  /**
   * @inheritdoc
   */
  update(url: string, body: { [index: string]: any }) {
    updateFormAction(this.store$)(this.client, url, body);
  }
  /**
   * @inheritdoc
   */
  create(url: string, body: { [index: string]: any }) {
    createFormAction(this.store$)(this.client, url, body);
  }
  /**
   * @inheritdoc
   */
  updateControl(url: string, body: { [index: string]: any }) {
    updateFormControlAction(this.store$)(this.client, url, body);
  }
  /**
   * @inheritdoc
   */
  createControl(url: string, body: { [index: string]: any }) {
    createFormControlAction(this.store$)(this.client, url, body);
  }
  /**
   * @inheritdoc
   */
  deleteFormControl(url: string, controlID: number) {
    deleteFormFormControl(this.store$)(url, {}, controlID);
  }
  /**
   * @inheritdoc
   */
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
   * @inheritdoc
   */
  get = (id: string | number, params?: { [prop: string]: any }) => {
    return this.client.get(`${this.path}/${id}`, params).pipe(
      map((state) => {
        const data = getResponseDataFromHttpResponse(state);
        return data ? FormV2.builder().fromSerialized(data) : undefined;
      })
    );
  };

  paginate(url: string, params: { [index: string]: any }) {
    onPaginateFormsAction(this.store$)(this.client, url, params);
  }

  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  cache = (endpoint: string, options: { [index: string]: any } = {}) => {
    return this.loader.load(endpoint, options).pipe(
      tap((state) =>
        onAddFormToStackAction(this.store$)(
          state?.map((value) => ({ ...value, cached: true }))
        )
      ),
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
}
