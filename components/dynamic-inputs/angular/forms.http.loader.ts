import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isArray } from "lodash";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { GenericUndecoratedSerializaleSerializer } from "../../../built-value/core/js/serializer";
import { FormV2 } from "../core/v2/models";

@Injectable({
    providedIn: 'root'
})
export class FormHttpLoader {

    public constructor(private _http: HttpClient) { }

    public load = (assets: string) => {
        return this._http.get(assets).pipe(
            map(state => {
                if (state && isArray(state)) {
                    return (state as any[]).map(value => {
                        return (new GenericUndecoratedSerializaleSerializer()
                            .fromSerialized(FormV2, value)) as FormV2;
                    });
                }
                return [];
            }),
            catchError(error => {
                return throwError(error);
            })
        )

    }
}
