import { Injectable } from '@angular/core';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { postRessource, postManyRessources, putRessource, getRessource, getRessources, deleteRessource } from '../contracts/abstract-request-client';
import { IResponseBody } from '../http/core';
import { IEntityServiceProvider } from '../contracts/entity-service-provider';
import { isDefined } from '../utils';

@Injectable()
export class DefaultEntityHandler<T> {

  /**
   * @description Oject initializer fn
   */
  constructor() { }

  /**
   * @description Add/Insert a new entry to the ressource storage
   * @param provider [[IEntityServiceProvider]]
   * @param builder [[builder: ISerializableBuilder<T>]]
   * @param ressourcePath [[string]]
   * @param value [[any]]
   * @param params [[object|null]]
   */
  public create(provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, ressourcePath: string, value: any, params?: object) {
    return postRessource<T>(provider, ressourcePath, value, builder, params);
  }
  /**
   * @description Add/Insert a new entry to the ressource storage
   * @param provider [[IEntityServiceProvider]]
   * @param ressourcePath [[string]]
   * @param value [[any[]]]
   * @param params [[object|null]]
   */
  public createMany(provider: IEntityServiceProvider, ressourcePath: string, value: any[], params?: object) {
    return postManyRessources(provider, ressourcePath, value, params);
  }

  /**
   * @description Update ressource in the data storage based on the ressource id
   * @param provider [[IEntityServiceProvider]]
   * @param ressourcePath [[string]]
   * @param value [[object]]
   * @param id [[number]]
   * @param params [[object|null]]
   */
  public update(provider: IEntityServiceProvider, ressourcePath: string, value: any, id?: string | number, params?: object) {
    // tslint:disable-next-line: deprecation
    return putRessource<IResponseBody>(provider, ressourcePath, id, value, params);
  }

  /**
   * @description Removes an item from the data storage based on either item id or parameters
   * @param provider [[IEntityServiceProvider]]
   * @param ressourcePath [[string]]
   * @param id [[number]]
   * @param params [[object|null]]
   */
  public delete(provider: IEntityServiceProvider, ressourcePath: string, id?: string | number, params?: object) {
    // tslint:disable-next-line: deprecation
    return deleteRessource<IResponseBody>(provider, ressourcePath, id, params);
  }

  /**
   * @description Query ressource using the provided [[id]] parameter
   * @param provider [[IEntityServiceProvider]]
   * @param builder [[ISerializableBuilder<T>]]
   * @param path [[string]]
   * @param id [[string|number|null]]
   * @param params [[object|null]]
   */
  public get(provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, path: string, id?: string | number, params?: object) {
    return getRessource<T>(provider, isDefined(id) ? `${path}/${id}` : `${path}`, builder, params);
  }

  /**
   * @description Get/Returns a list of ressources from the data storage
   * @param provider [[IEntityServiceProvider]]
   * @param builder [[ISerializableBuilder<T>]]
   * @param ressourcePath [[string]]
   * @param key [[string]]
   * @param params [[object]]
   */
  public getAll(provider: IEntityServiceProvider, builder: ISerializableBuilder<T>, ressourcePath: string, params?: object, key?: string) {
    return getRessources<T>(provider, ressourcePath, builder, key, params);
  }
}
