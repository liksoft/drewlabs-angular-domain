
import { RessourcesEndpointQuery } from '../../components/ng-data-table/contracts/ressources-enpoint-query';
import { GenericPaginatorDatasource } from '../../helpers/paginator';
import { ISerializableBuilder } from '../../built-value/contracts/serializers';
import { IEntityServiceProvider } from '../../contracts/entity-service-provider';
import { IResponseBody } from '../../http/contracts/http-response-data';

// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: interface-over-type-literal
export type EntityPaginator<T> = {
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
export type EntityHandlers<T> = {
  create: Create<T>, createMany: CreateMany, update: Update, delete: Delete, get: Get<T>, getAll: GetAll<T>
};

// tslint:disable-next-line: interface-over-type-literal
export type HandlersResultMsg = { success: () => void, error: (error: any) => void, warnings: (errors: any) => void, unknown?: () => void };
