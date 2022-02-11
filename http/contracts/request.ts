type Request = {
  path: string;
  params?: { [index: string]: any };
  headers?:
    | string
    | {
        [name: string]: string | string[];
      };
};

/**
 * @description Type definition for a create entity event
 */
export interface CreateRequest extends Request {
  body: { [index: string]: any };
}

/**
 * @description Type definition for an update entity event
 */
export interface UpdateRequest extends Request {
  body: { [index: string]: any };
  id?: number | string;
}
/**
 * @description Type definition for a delete entity event
 */
export interface DeleteRequest extends Request {
  id?: number | string;
}
/**
 * @description Type definition for a get entity(s) event
 */
export interface GetRequest extends Request {
  id?: number | string;
}
