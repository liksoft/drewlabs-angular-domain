import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";
import { UIState, UIStateProvider, UIStateStatusCode } from "../contracts/ui-state";
import { createSubject } from "../rxjs/helpers";

const initialUIState: UIState = {
    performingAction: false,
    uiMessage: null,
    hasError: false,
    status: null
};

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
            status: null
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