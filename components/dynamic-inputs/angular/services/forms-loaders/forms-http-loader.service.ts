import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isArray } from "lodash";
import { catchError, map } from "rxjs/operators";
import { GenericUndecoratedSerializaleSerializer } from "../../../../../built-value/core/js/serializer";
import { DynamicFormInterface } from "../../../core/compact";
import { FormV2 } from "../../../core/v2/models";
import { FormsLoaderInterface } from "./types";

@Injectable()
export class FormHttpLoader implements FormsLoaderInterface {
  public constructor(private _http: HttpClient) {}

  public load = (endpoint: string, options?: { [index: string]: any }) => {
    return this._http.get(endpoint, options || {}).pipe(
      map((state) => {
        if (state && isArray(state)) {
          return (state as any[]).map((value) => {
            return new GenericUndecoratedSerializaleSerializer().fromSerialized(
              FormV2,
              value
            ) as DynamicFormInterface;
          });
        }
        return [];
      })
    );
  };
}
