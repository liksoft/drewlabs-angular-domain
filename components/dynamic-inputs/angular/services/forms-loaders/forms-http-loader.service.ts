import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { createFormElement, FormsLoader } from "../../../core";

@Injectable()
export class FormHttpLoader implements FormsLoader {
  public constructor(private _http: HttpClient) {}

  public load = (endpoint: string, options?: { [index: string]: any }) => {
    return this._http.get(endpoint, options || {}).pipe(
      map((state) => {
        if (state && Array.isArray(state)) {
          return (state as any[]).map((value: { [index: string]: any }) => {
            let controls = value ? (value["formControls"] as any[]) ?? [] : [];
            if (controls.length === 0) {
              controls = value ? (value["controls"] as any[]) ?? [] : [];
            }
            if (controls.length !== 0) {
              value = {
                ...value,
                controls: controls,
              };
            }
            return createFormElement(value);
          });
        }
        return [];
      })
    );
  };
}
