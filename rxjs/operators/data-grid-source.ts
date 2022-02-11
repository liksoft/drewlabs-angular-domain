import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { isArray } from "../../utils/types";

/**
 * @description Add request query parameters configurastion the paginator source
 * @param config Pagination configuration value
 * @deprecated
 */
export const mapSourceWithConfigs = (
  params: { [index: string]: any }[] | { [index: string]: any } = []
) => {
  return (source$: Observable<{ [index: string]: any }>) => {
    return source$.pipe(
      map((state) =>
        isArray(params) ? { state, ...params } : { state, params }
      )
    );
  };
};
