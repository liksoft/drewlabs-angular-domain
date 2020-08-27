import { Injectable, OnDestroy, Injector, EventEmitter } from '@angular/core';
import { IDataSourceService, ISource, ISourceRequestQueryParameters } from '../components/ng-data-table/ng-data-table.component';
import { HttpGetAllRequestFn, RequestClient } from '../contracts/abstract-request-client';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { HttpRequestService, ResponseData, IResponseBody, ResponseBody } from '../http/core';
// import { SessionStorage } from '../storage/core';
import { isArray, isDefined } from '../utils/type-utils';
import { AppUIStoreManager } from './app-ui-store-manager.service';
import { AbstractAlertableComponent } from './component-interfaces';
import { Dialog } from '../utils/window-ref';
import { TranslationService } from '../translator/translator.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ClrDatagrid, ClrDatagridStateInterface } from '@clr/angular';
import { from } from 'rxjs';

@Injectable()
export class GenericPaginatorDatasource<T> implements IDataSourceService<ISource<T>>, OnDestroy {

  // tslint:disable-next-line: variable-name
  private _getMethod: HttpGetAllRequestFn;
  // tslint:disable-next-line: variable-name
  private _ressourcePath: string;
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
    // private cache: SessionStorage
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

export interface ToExcelHeaderEventArgs {
  data: object[];
  headers: { [index: string]: string };
  datefield?: string[];
}

export abstract class ClrDatagridBaseComponent<T> extends AbstractAlertableComponent {

  private dialog: Dialog;
  private translate: TranslationService;
  public dataGrid: ClrDatagrid;
  public source: ISource<T>;
  public ressourcesPath: string;
  public ressourcesJsonKey: string;
  selectedItem = new EventEmitter<T>();
  deleteItem = new EventEmitter<T>();
  createItem = new EventEmitter<object>();
  exportToExcel = new EventEmitter<ToExcelHeaderEventArgs>();
  currentGridState: ClrDatagridStateInterface;
  // tslint:disable-next-line: variable-name
  private _inlineQuery: string;
  protected showLoader = true;

  defaultClrPaginatorSizeOptions = [10, 50, 100, 500, 1000];
  // List of filters to be binded before querying ressources
  protected filters: { [index: string]: any } = {};

  constructor(
    injector: Injector,
    readonly provider: GenericPaginatorDatasource<T>,
    private builder: ISerializableBuilder<T>
  ) {
    super(injector.get(AppUIStoreManager));
    this.dialog = injector.get(Dialog);
    this.translate = injector.get(TranslationService);
  }

  set inlineQuery(value: string) {
    this._inlineQuery = value;
  }

  /**
   * Register observables and provides listeners to paginator state events
   */
  initState() {
    this.subscribeToUIActions();
    // Subscribe to refresh and of the datagrid and debounce reload for 1 seconds
    this.uiStoreSubscriptions.push(this.dataGrid.refresh.asObservable().pipe(
      debounceTime(500),
      // distinctUntilChanged(),
      switchMap((state) => from(this.refresh(state))),
    ).subscribe(async (state) => {
      try {
        if (this.showLoader) {
          this.appUIStoreManager.initializeUIStoreAction();
        }
        this.source = await (this.provider)
          .resetScope()
          .setResponseJsonKey(this.ressourcesJsonKey)
          .setRessourcePath(this.ressourcesPath)
          .setInlineQuery(this._inlineQuery)
          .setBuider(this.builder)
          .setQueryParameters(Object.assign(state.filters, this.filters))
          .getItems(state.params);
        this.appUIStoreManager.completeUIStoreAction();
      } catch (error) {
        this.appUIStoreManager.completeUIStoreAction();
      }
    }));
  }

  /**
   * @description Handle user click event to update entity values
   * @param item [[T]]
   */
  async onSelectedItem(item: T) {
    this.selectedItem.emit(item);
  }

  /**
   * @description Handle user click events to delete entity
   * @param config [[T]]
   */
  async onDeleteItem(config: T) {
    const translations = await this.translate.loadTranslations(['prompt']);
    if (this.dialog.confirm(translations.prompt)) {
      this.deleteItem.emit(config);
    }
  }

  entityAssignmentCompleted() {
    this.dgRefesh();
    setTimeout(() => {
      this.appUIStoreManager.completeUIStoreAction();
    }, 3000);
  }

  /**
   * @description Responds to user create new action
   */
  onCreateItem() {
    this.createItem.emit({});
  }

  /**
   * @description Override this function to provide data exportation to class extending this class
   * @overridable
   */
  onExportToExcel() {
    // Provide implementation for excel data exportation
    throw new Error('UnImplement method calls...');
  }

  /**
   * @description Handler for the ClrDataGrid refresh event
   * @param state [[ClrDatagridStateInterface]]
   */
  public async refresh(state: ClrDatagridStateInterface) {
    // We convert the filters from an array to a map,
    // because that's what our backend-calling service is expecting
    this.currentGridState = state;
    // We convert the filters from an array to a map,
    // because that's what our backend-calling service is expecting
    const filters: { [prop: string]: any[] } = {};
    let params: ISourceRequestQueryParameters = {} as ISourceRequestQueryParameters;
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter as { property: string, value: string };
        filters[property] = [value];
      }
    }
    if (state.page) {
      params = {
        page: state.page.current,
        perPage: state.page.size
      };
    }
    return { filters, params };
  }

  dgRefesh() {
    this.dataGrid.refresh.emit(this.currentGridState);
  }

  dispose() {
    this.resetUIStore();
  }
}
