import { Subscription, Subject } from 'rxjs';
import { CreateReq, UpdateReq, DeleteReq, GetReq, GetAllReq } from './contracts/requests';
import { IResponseBody } from '../http/contracts/http-response-data';
import { ISource } from '../components/ng-data-table/ng-data-table.component';
import { filter } from 'rxjs/operators';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { TypeUtilHelper } from '../helpers/type-utils-helper';
import { Injectable, OnDestroy } from '@angular/core';
import { IEntityServiceProvider } from '../contracts/entity-service-provider';
import { DefaultEntityHandler } from './entity-handler-provider';
import { EntityPaginator, EntityHandlers } from './contracts/entity-handler-types';
import { isDefined } from '../utils';

@Injectable()
export class AbstractEntityProvider<T> implements OnDestroy {

  /**
   * @description Triggers entity creation event
   */
  public readonly createRequest = new Subject<{ builder: ISerializableBuilder<T>, req: CreateReq }>();

  /**
   * @description Triggers entity update event
   */
  public readonly updateRequest = new Subject<{ builder?: ISerializableBuilder<T>, req: UpdateReq }>();

  /**
   * @description Triggers entity delete event
   */
  public readonly deleteRequest = new Subject<{ builder?: ISerializableBuilder<T>, req: DeleteReq }>();

  /**
   * @description Triggers /GET entity event
   */
  public readonly getRequest = new Subject<{ builder: ISerializableBuilder<T>, req: GetReq }>();

  /**
   * @description Triggers /GETALL entity event
   */
  public readonly getAllRequest = new Subject<{ builder: ISerializableBuilder<T>, req: GetAllReq }>();

  /**
   * @description Get triggers when entity create event gets completed successfully
   */
  // tslint:disable-next-line: variable-name
  protected _createResult =
    // tslint:disable-next-line: deprecation
    new Subject<T | IResponseBody | boolean>();
  get createResult$() {
    return this._createResult.asObservable();
  }

  /**
   * @description Get triggers when entity event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _updateResult =
    // tslint:disable-next-line: deprecation
    new Subject<IResponseBody>();
  get updateResult$() {
    return this._updateResult.asObservable();
  }

  /**
   * @description Get triggers when entity update/delete event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _deleteResult =
    // tslint:disable-next-line: deprecation
    new Subject<IResponseBody>();
  get deleteResult$() {
    return this._deleteResult.asObservable();
  }

  /**
   * @description Get triggers when entity /GET event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _getResult = new Subject<T>();
  get getResult$() {
    return this._getResult.asObservable();
  }
  /**
   * @description Get triggers when entity /GET event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _getAllResult = new Subject<T[]>();
  get getAllResult$() {
    return this._getAllResult.asObservable();
  }

  /**
   * @description Paginator data source observable
   */
  // tslint:disable-next-line: variable-name
  protected _paginatorDataSource = new Subject<ISource<T>>();
  get paginatorDataSource$() {
    return this._paginatorDataSource.asObservable();
  }

  /**
   * @description A subject provider that gets triggers when pagination data changes
   */
  // tslint:disable-next-line: max-line-length
  public readonly loadPaginatorData = new Subject<EntityPaginator<T>>();

  // tslint:disable-next-line: variable-name
  protected _subjects: Subject<any>[];

  protected subscriptions: Subscription[] = [];

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
    this._subjects = [this.createRequest, this.updateRequest,
    this.deleteRequest, this._createResult, this._updateResult,
    this._deleteResult, this._paginatorDataSource, this.loadPaginatorData
    ];
    this.handlers = {
      create: entityHandler.create, createMany: entityHandler.createMany, update: entityHandler.update,
      delete: entityHandler.delete, get: entityHandler.get, getAll: entityHandler.getAll
    };
  }

  /**
   * @description Setter method for [[provider]] property
   * @param provider [[IEntityServiceProvider]]
   */
  public setProvider(provider: IEntityServiceProvider) {
    this.provider = provider;
    return this;
  }

  /**
   * @description Getter method for [[provider]] property
   */
  public getProvider() {
    return this.provider;
  }

  /**
   * @description [[hanlders]] property setter
   * @param _handlers [[EntityHandlers<T>]]
   */
  // tslint:disable-next-line: variable-name
  public setHandlers(_handlers: EntityHandlers<T>) {
    this.handlers = _handlers;
    return this;
  }

  /**
   * @description Returns the list of CRUD hanlders for the entity object
   */
  public getHandlers() {
    return this.handlers;
  }

  public subscribe() {
    if (!this.typeHelper.isDefined(this.handlers) || (Object.keys(this.handlers).length < 0)) {
      throw Error('CRUD handlers must not be null... Please set required properties on the handlers');
    }
    // Subscribe to load form event
    this.subscriptions.push(
      ...[
        // /POST/[id]?params entity handler publisher
        this.createRequest.asObservable().pipe(
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
        this.updateRequest.asObservable().pipe(
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
        this.deleteRequest.asObservable().pipe(
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
        this.getRequest.asObservable().pipe(
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
        this.getAllRequest.asObservable().pipe(
          filter((source) => this.typeHelper.isDefined(source))
        ).subscribe(async (source) => {
          try {
            // tslint:disable-next-line: max-line-length
            this._getAllResult.next(await this.handlers.getAll(this.provider, source.builder, source.req.path, source.req.params, source.req.dataKey));
          } catch (error) {
            // Show an error message en case of error
            throw error;
          }
        })
      ]);
  }

  /**
   * @description Subscribe to clarity data grid paginator changes
   */
  public subscribeToPaginationChanges() {
    this.loadPaginatorData.asObservable().pipe(
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
  public async queryRessource(source: EntityPaginator<T>) {
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
  public unsubscribeToPaginatorDataChanges() {
    this._paginatorDataSource.observers.forEach((ob) => ob.complete());
  }

  unsubscribe() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    return this;
  }

  onCompleActionListeners(actions: Subject<any>[]) {
    actions.forEach((a) => a.observers.forEach((ob) => ob.complete()));
  }

  public ngOnDestroy() {
    this._subjects.forEach((s) => s.complete());
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
