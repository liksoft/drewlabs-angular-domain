import { CreateReq, UpdateReq, DeleteReq, GetReq, GetAllReq } from './contracts/requests';
import { IResponseBody } from '../http/contracts/http-response-data';
import { ISource } from '../components/ng-data-table/ng-data-table.component';
import { filter, takeUntil } from 'rxjs/operators';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { TypeUtilHelper } from '../helpers/type-utils-helper';
import { Injectable, OnDestroy } from '@angular/core';
import { IEntityServiceProvider } from '../contracts/entity-service-provider';
import { DefaultEntityHandler } from './entity-handler-provider';
import { EntityPaginator, EntityHandlers } from './contracts/entity-handler-types';
import { isDefined } from '../utils';
import { createSubject } from '../rxjs/helpers';

@Injectable()
export class AbstractEntityProvider<T> implements OnDestroy {

  /**
   * @description Triggers entity creation event
   */
  public readonly createRequest = createSubject<{ builder: ISerializableBuilder<T>, req: CreateReq }>();

  /**
   * @description Triggers entity update event
   */
  public readonly updateRequest = createSubject<{ builder?: ISerializableBuilder<T>, req: UpdateReq }>();

  /**
   * @description Triggers entity delete event
   */
  public readonly deleteRequest = createSubject<{ builder?: ISerializableBuilder<T>, req: DeleteReq }>();

  /**
   * @description Triggers /GET entity event
   */
  public readonly getRequest = createSubject<{ builder: ISerializableBuilder<T>, req: GetReq }>();

  /**
   * @description Triggers /GETALL entity event
   */
  public readonly getAllRequest = createSubject<{ builder: ISerializableBuilder<T>, req: GetAllReq }>();

  /**
   * @description Get triggers when entity create event gets completed successfully
   */
  // tslint:disable-next-line: variable-name
  protected _createResult =
    // tslint:disable-next-line: deprecation
    createSubject<T | IResponseBody | boolean>();
  // tslint:disable-next-line: typedef
  get createResult$() {
    return this._createResult.asObservable();
  }

  /**
   * @description Get triggers when entity event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _updateResult =
    // tslint:disable-next-line: deprecation
    createSubject<IResponseBody>();
  // tslint:disable-next-line: typedef
  get updateResult$() {
    return this._updateResult.asObservable();
  }

  /**
   * @description Get triggers when entity update/delete event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _deleteResult =
    // tslint:disable-next-line: deprecation
    createSubject<IResponseBody>();
  // tslint:disable-next-line: typedef
  get deleteResult$() {
    return this._deleteResult.asObservable();
  }

  /**
   * @description Get triggers when entity /GET event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _getResult = createSubject<T>();
  // tslint:disable-next-line: typedef
  get getResult$() {
    return this._getResult.asObservable();
  }
  /**
   * @description Get triggers when entity /GET event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _getAllResult = createSubject<T[]>();
  // tslint:disable-next-line: typedef
  get getAllResult$() {
    return this._getAllResult.asObservable();
  }

  /**
   * @description Paginator data source observable
   */
  // tslint:disable-next-line: variable-name
  protected _paginatorDataSource = createSubject<ISource<T>>();
  // tslint:disable-next-line: typedef
  get paginatorDataSource$() {
    return this._paginatorDataSource.asObservable();
  }

  /**
   * @description A subject provider that gets triggers when pagination data changes
   */
  // tslint:disable-next-line: max-line-length
  public readonly loadPaginatorData = createSubject<EntityPaginator<T>>();

  public readonly destroy$ = createSubject();
  // tslint:disable-next-line: variable-name
  private _completePagination$ = createSubject();

  /**
   * @var [[EntityHandlers<T>]]
   */
  protected handlers: EntityHandlers<T>;

  /**
   * @description Service provider for manipulating entity binded with this class
   */
  private provider: IEntityServiceProvider;

  constructor(
    private typeHelper: TypeUtilHelper,
    entityHandler: DefaultEntityHandler<T>
  ) {
    this.handlers = {
      create: entityHandler.create, createMany: entityHandler.createMany, update: entityHandler.update,
      delete: entityHandler.delete, get: entityHandler.get, getAll: entityHandler.getAll
    };
  }

  /**
   * @description Setter method for [[provider]] property
   * @param provider [[IEntityServiceProvider]]
   */
  // tslint:disable-next-line: typedef
  public setProvider(provider: IEntityServiceProvider) {
    this.provider = provider;
    return this;
  }

  /**
   * @description Getter method for [[provider]] property
   */
  // tslint:disable-next-line: typedef
  public getProvider() {
    return this.provider;
  }

  /**
   * @description [[hanlders]] property setter
   * @param _handlers [[EntityHandlers<T>]]
   */
  // tslint:disable-next-line: typedef
  public setHandlers(
    // tslint:disable-next-line: variable-name
    _handlers: EntityHandlers<T>) {
    this.handlers = _handlers;
    return this;
  }

  /**
   * @description Returns the list of CRUD hanlders for the entity object
   */
  // tslint:disable-next-line: typedef
  public getHandlers() {
    return this.handlers;
  }

  // tslint:disable-next-line: typedef
  public subscribe() {
    if (!this.typeHelper.isDefined(this.handlers) || (Object.keys(this.handlers).length < 0)) {
      throw Error('CRUD handlers must not be null... Please set required properties on the handlers');
    }
    // /POST/[id]?params entity handler publisher
    this.createRequest.asObservable()
      .pipe(
        takeUntil(this.destroy$),
        filter((source) => this.typeHelper.isDefined(source)),
      ).subscribe(async (source) => {
        try {
          // tslint:disable-next-line: max-line-length
          this._createResult.next(await this.handlers.create(this.provider, source.builder, source.req.path, source.req.body));
        } catch (error) {
          // Show an error message en case of error
          throw error;
        }
      }),
      // /PUT/[id]?params entity handler publisher
      this.updateRequest.asObservable()
        .pipe(
          takeUntil(this.destroy$),
          filter((source) => this.typeHelper.isDefined(source))
        ).subscribe(async (source) => {
          try {
            // tslint:disable-next-line: max-line-length
            this._updateResult.next(await this.handlers.update(this.provider, source.req.path, source.req.body, source.req.id, source.req.params));
          } catch (error) {
            // Show an error message en case of error
            throw error;
          }
        }),
      // /DELETE/[id]?params entity handler publisher
      this.deleteRequest.asObservable()
        .pipe(
          takeUntil(this.destroy$),
          filter((source) => this.typeHelper.isDefined(source))
        ).subscribe(async (source) => {
          try {
            this._deleteResult.next(await this.handlers.delete(this.provider, source.req.path, source.req.id, source.req.params));
          } catch (error) {
            // Show an error message en case of error
            throw error;
          }
        }),
      // /GET/[id] entity handler publisher
      this.getRequest.asObservable()
        .pipe(
          takeUntil(this.destroy$),
          filter((source) => this.typeHelper.isDefined(source))
        ).subscribe(async (source) => {
          try {
            this._getResult.next(await this.handlers.get(this.provider, source.builder, source.req.path, source.req.id, source.req.params));
          } catch (error) {
            // Show an error message en case of error
            throw error;
          }
        }),
      // /GET[?params] entity handler publisher
      this.getAllRequest.asObservable()
        .pipe(
          takeUntil(this.destroy$),
          filter((source) => this.typeHelper.isDefined(source))
        ).subscribe(async (source) => {
          try {
            // tslint:disable-next-line: max-line-length
            this._getAllResult.next(await this.handlers.getAll(this.provider, source.builder, source.req.path, source.req.params, source.req.dataKey));
          } catch (error) {
            // Show an error message en case of error
            throw error;
          }
        });
  }

  /**
   * @description Subscribe to clarity data grid paginator changes
   */
  public subscribeToPaginationChanges = () => {
    this.loadPaginatorData.asObservable()
      .pipe(
        takeUntil(this._completePagination$),
        filter((state) => isDefined(state))
      ).subscribe(async (state) => {
        try {
          const data = await this.queryRessource(state);
          this._paginatorDataSource.next(data);
        } catch (error) {
          // Show an error message en case of error
          throw error;
        }
      });
  }

  /**
   * @description Ressources pagination provider
   * @param source [[EntityPaginator<T>]]
   */
  public queryRessource = async (source: EntityPaginator<T>) => {
    return (source.provider)
      .resetScope()
      .setRessourcePath(source.path)
      .setStatus(source.query.status)
      .setInlineQuery(this.typeHelper.isDefined(source.query.inlineQuery) ? source.query.inlineQuery : null)
      .setBuider(source.builder)
      .setQueryParameters(source.query.filters)
      .getItems(source.query.params);
  }

  /**
   * @description Close subscription to [[_paginatorDataSource]] events
   */
  public unsubscribeToPaginatorDataChanges = () => {
    this._paginatorDataSource.observers.forEach((ob) => ob.complete());
  }

  unsubscribe = () => {
    this.destroy$.next({});
    return this;
  }

  onCompleActionListeners = (actions: any[] = null) => {
    this.unsubscribe();
  }

  // tslint:disable-next-line: typedef
  public ngOnDestroy() {
    this.destroy$.next({});
    this._completePagination$.next({});
  }
}
