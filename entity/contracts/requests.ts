
/**
 * @description Type definition for a create entity event
 */
export interface CreateReq {
    body: object | any;
    path: string;
    params?: object;
}

/**
 * @description Type definition for an update entity event
 */
export interface UpdateReq {
    body: object | any;
    path: string;
    id?: number | string;
    params?: object;
}
/**
 * @description Type definition for a delete entity event
 */
export interface DeleteReq {
    path: string;
    id?: number | string;
    params?: object;
}
/**
 * @description Type definition for a get entity(s) event
 */
export interface GetReq {
    path: string;
    id?: number | string;
    params?: object;
}
/**
 * @description Type definition for a get entity(s) event
 */
export interface GetAllReq {
    path: string;
    dataKey?: string;
    id?: number | string;
    params?: object;
}
