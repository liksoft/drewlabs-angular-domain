import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, } from "rxjs/operators";
import { emptyObservable } from "../../../rxjs/helpers";
import { DrewlabsFluxStore, onErrorAction } from "../../../rxjs/state/rx-state";
import { ErrorHandler } from "../../contracts/error-handler";

export const handleError = (handler: ErrorHandler, store?: DrewlabsFluxStore<any, any>) => (source$: Observable<any>) => {
    return source$.pipe(
        catchError(err => {
            if (err instanceof HttpErrorResponse) {
                const errorResponse = handler.handleError(err);
                if (store) {
                    onErrorAction(store)(errorResponse);
                }
            } else {
                if (store) {
                    onErrorAction(store)(err);
                }
            }
            return emptyObservable();
        })
    );
};
