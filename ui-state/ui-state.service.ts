import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";
import { UIState, UIStateProvider, UIStateStatusCode } from "../contracts/ui-state";
import { HTTPErrorState } from "../http/core/http-request.service";
import { DrewlabsHttpResponseStatusCode } from "../http/core/http-response";
import { createSubject } from "../rxjs/helpers";

const initialUIState: UIState = {
    performingAction: false,
    uiMessage: undefined,
    hasError: false,
    status: undefined
};

/**
 * @description UIstate status code helper for getting state from http response error status
 */
 export const uiStatusUsingHttpErrorResponse = (httpErrorState: HTTPErrorState) =>
 (httpErrorState.status === DrewlabsHttpResponseStatusCode.SERVER_ERROR) ||
   (httpErrorState.status === DrewlabsHttpResponseStatusCode.UNKNOWN) ?
   UIStateStatusCode.ERROR : UIStateStatusCode.BAD_REQUEST;

@Injectable({
    providedIn: 'root'
})
export class AppUIStateProvider implements UIStateProvider {
    private store$ = createSubject<UIState>();

    // tslint:disable-next-line: typedef
    intialize() {
        this.store$.next(initialUIState);
    }

    get uiState(): Observable<UIState> {
        return this.store$.pipe(
            startWith(initialUIState)
        );
    }

    startAction(message?: string): void {
        this.store$.next({
            performingAction: true,
            uiMessage: message,
            hasError: false,
            status: undefined
        });
    }

    endAction(message?: string, status?: UIStateStatusCode): void {
        this.store$.next({
            performingAction: false,
            uiMessage: message,
            hasError: status === UIStateStatusCode.ERROR ? true : false,
            status
        });
    }

    resetState(): void {
        this.store$.next(initialUIState);
    }
}