import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/core/http-request.service';
import { TypeUtilHelper } from '../helpers/type-utils-helper';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { postRessource, postManyRessources, putRessource, getRessource, getRessources, deleteRessource } from '../contracts/abstract-request-client';
import { IResponseBody } from '../http/core';

@Injectable()
export class EntityBaseHttpService<T> {

    /**
     * @description Oject initializer fn
     * @param client [[HttpRequestService]]
     * @param typeHelper [[TypeUtilHelper]]
     */
    constructor(private client: HttpRequestService, private typeHelper: TypeUtilHelper) { }

    /**
     * @description Add/Insert a new entry to the ressource storage
     * @param builder [[builder: ISerializableBuilder<T>]]
     * @param ressourcePath [[string]]
     * @param value [[any]]
     * @param params [[object|null]]
     */
    public create(builder: ISerializableBuilder<T>, ressourcePath: string, value: any, params?: object) {
        return postRessource<T>(this.client, ressourcePath, value, builder, params);
    }
    /**
     * @description Add/Insert a new entry to the ressource storage
     * @param ressourcePath [[string]]
     * @param value [[any[]]]
     * @param params [[object|null]]
     */
    public createMany(ressourcePath: string, value: any[], params?: object) {
        return postManyRessources(this.client, ressourcePath, value, params);
    }

    /**
     * @description Update ressource in the data storage based on the ressource id
     * @param ressourcePath [[string]]
     * @param value [[object]]
     * @param id [[number]]
     * @param params [[object|null]]
     */
    public update(ressourcePath: string, value: any, id?: string | number, params?: object) {
        return putRessource<IResponseBody>(this.client, ressourcePath, id, value, params);
    }

    /**
     * @description Removes an item from the data storage based on either item id or parameters
     * @param ressourcePath [[string]]
     * @param id [[number]]
     * @param params [[object|null]]
     */
    public delete(ressourcePath: string, id?: string | number, params?: object) {
        return deleteRessource<IResponseBody>(this.client, ressourcePath, id, params);
    }

    /**
     * @description Query ressource using the provided [[id]] parameter
     * @param builder [[ISerializableBuilder<T>]]
     * @param path [[string]]
     * @param id [[string|number|null]]
     * @param params [[object|null]]
     */
    public get(builder: ISerializableBuilder<T>, path: string, id?: string | number, params?: object) {
        return getRessource<T>(this.client, this.typeHelper.isDefined(id) ? `${path}/${id}` : `${path}`, builder, params);
    }

    /**
     * @description Get/Returns a list of ressources from the data storage
     * @param builder [[ISerializableBuilder<T>]]
     * @param ressourcePath [[string]]
     * @param key [[string]]
     * @param params [[object]]
     */
    public getAll(builder: ISerializableBuilder<T>, ressourcePath: string, params?: object, key?: string) {
        return getRessources<T>(this.client, ressourcePath, builder, key, params);
    }
}
