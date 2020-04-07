import { Subject, Subscription } from 'rxjs';
import { CreateReq, UpdateReq, DeleteReq, GetReq, GetAllReq } from './contracts/requests';
import { IResponseBody } from '../http/contracts/http-response-data';
import { ISource } from '../components/ng-data-table/ng-data-table.component';
import { RessourcesEndpointQuery } from '../components/ng-data-table/contracts/ressources-enpoint-query';
import { isDefined } from '../utils/type-utils';
import { filter } from 'rxjs/operators';

// import { ICollection } from '../contracts/collection-interface';
// import { IEntity } from './entity-interface';
// import { Filtrable } from '../contracts/filtrable';
// import { Collection } from '../utils/collection';
import { GenericPaginatorDatasource } from '../helpers/paginator';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { TypeUtilHelper } from '../helpers/type-utils-helper';
import { DefaultEntityHandler } from './entity-base.service';
import { Injectable, OnDestroy } from '@angular/core';
import { IEntityServiceProvider } from '../contracts/entity-service-provider';

// export abstract class AbstractEntity implements IEntity, Filtrable {

//   protected fillables = [];

//   /**
//    * @inheritdoc
//    */
//   toMap(): object | ICollection<any> {
//     const collection = new Collection<any>();
//     this.fillables.forEach(value => {
//       collection.add(value, this[value]);
//     });
//     return collection;
//   }

//   /**
//    * @inheritdoc
//    */
//   fromEntries(entry: object) {
//     for (const [k, v] of Object.entries(entry)) {
//       if (this.fillables.indexOf(k) !== -1) {
//         this[k] = v;
//       }
//     }
//     return this;
//   }
//   /**
//    * @inheritdoc
//    */
//   getEntityKey(): string {
//     return 'id';
//   }

//   has(key: string, value: any): boolean {
//     const item = this[key];
//     return (item.toString() as string).includes(value);
//   }
// }

// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: interface-over-type-literal
type EntityPaginator<T> = {
  query: RessourcesEndpointQuery, builder: ISerializableBuilder<T>, path: string, provider: GenericPaginatorDatasource<T>
};

/**
 * @description Add/Insert a new entry to the ressource storage
 * @param provider [[IEntityServiceProvider]]
 * @param builder [[builder: ISerializableBuilder<T>]]
 * @param ressourcePath [[string]]
 * @param value [[any]]
 * @param params [[object|null]]
 */
// tslint:disable-next-line: max-line-length
type Create<T> = (provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, ressourcePath: string, value: any, params?: object) => Promise<IResponseBody | T>;

/**
 * @description Add/Insert a new entry to the ressource storage
 * @param provider [[IEntityServiceProvider]]
 * @param ressourcePath [[string]]
 * @param value [[any[]]]
 * @param params [[object|null]]
 */
type CreateMany = (provider: IEntityServiceProvider, ressourcePath: string, value: any[], params?: object) => Promise<IResponseBody>;


/**
 * @description Update ressource in the data storage based on the ressource id
 * @param provider [[IEntityServiceProvider]]
 * @param ressourcePath [[string]]
 * @param value [[object]]
 * @param id [[number]]
 * @param params [[object|null]]
 */
type Update =
  (provider: IEntityServiceProvider, ressourcePath: string, value: any, id?: string | number, params?: object) => Promise<IResponseBody>;

/**
 * @description Delete ressource from storage using a provider implementations based ressource id or provided parameters
 * provider [[IEntityServiceProvider]]
 * @param ressourcePath [[string]]
 * @param value [[object]]
 * @param id [[number]]
 * @param params [[object|null]]
 */
type Delete =
  (provider: IEntityServiceProvider, ressourcePath: string, id?: string | number, params?: object) => Promise<IResponseBody>;

/**
 * @description Query for a ressource using the provided [[id]] parameter
 * @param provider [[IEntityServiceProvider]]
 * @param builder [[ISerializableBuilder<T>]]
 * @param path [[string]]
 * @param id [[string|number|null]]
 * @param params [[object|null]]
 */
type Get<T> =
  (provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, path: string, id?: string | number, params?: object) => Promise<T>;

/**
 * @description Get/Returns a list of ressources from the data storage
 * @param provider [[IEntityServiceProvider]]
 * @param builder [[ISerializableBuilder<T>]]
 * @param ressourcePath [[string]]
 * @param key [[string]]
 * @param params [[object]]
 */
type GetAll<T> =
  (provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, ressourcePath: string, params?: object, key?: string)
    => Promise<T[]>;

/**
 * @description Type definition for entity CRUD handlers
 */
// tslint:disable-next-line: interface-over-type-literal
type EntityHandlers<T> = { create: Create<T>, createMany: CreateMany, update: Update, delete: Delete, get: Get<T>, getAll: GetAll<T> };

// tslint:disable-next-line: interface-over-type-literal
export type HandlersResultMsg = { success: () => void, error: (error: any) => void, warnings: (errors: any) => void, unknown?: () => void };

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

  // /**
  //  * @description Get triggers when entity create event gets completed
  //  */
  // public readonly createResultOk = new Subject<{ req: T | IResponseBody>();

  /**
   * @description Get triggers when entity create event gets completed successfully
   */
  // tslint:disable-next-line: variable-name
  protected _createResult = new Subject<T | IResponseBody | boolean>();
  get createResult$() {
    return this._createResult.asObservable();
  }

  /**
   * @description Get triggers when entity event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _updateResult = new Subject<IResponseBody>();
  get updateResult$() {
    return this._updateResult.asObservable();
  }

  /**
   * @description Get triggers when entity update/delete event gets completed
   */
  // tslint:disable-next-line: variable-name
  public readonly _deleteResult = new Subject<IResponseBody>();
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
    httpProvider: DefaultEntityHandler<T>
  ) {
    this._subjects = [this.createRequest, this.updateRequest,
    this.deleteRequest, this._createResult, this._updateResult,
    this._deleteResult, this._paginatorDataSource, this.loadPaginatorData
    ];
    this.handlers = {
      create: httpProvider.create, createMany: httpProvider.createMany, update: httpProvider.update,
      delete: httpProvider.delete, get: httpProvider.get, getAll: httpProvider.getAll
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
