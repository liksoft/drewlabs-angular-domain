import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isArray } from "lodash";
import { map } from "rxjs/operators";
import { createFormElement, FormsLoader } from "../../../core";

@Injectable()
export class FormHttpLoader implements FormsLoader {
  public constructor(private _http: HttpClient) {}

  public load = (endpoint: string, options?: { [index: string]: any }) => {
    return this._http.get(endpoint, options || {}).pipe(
      map((state) => {
        if (state && isArray(state)) {
          return (state as any[]).map((value: { [index: string]: any }) => {
            if (
              (value?.formControls ?? [])?.length !== 0 &&
              (value?.controls ?? []).length === 0
            ) {
              value = { ...value, controls: value?.formControls };
            }
            return createFormElement(value);
          });
        }
        return [];
      })
    );
  };
}
