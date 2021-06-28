import { Observable } from "rxjs";

export enum UIStateStatusCode {
    STATUS_OK = 200,
    STATUS_CREATED = 201,
    BAD_REQUEST = 422,
    ERROR = 500,
    UNAUTHORIZED = 401,
    AUTHENTICATED = 202,
    UNAUTHENTICATED = 403
}

export interface UIState {
    performingAction: boolean;
    uiMessage?: string;
    hasError?: boolean;
    status?: number;
}

export interface UIStateProvider {
    

  // tslint:disable-next-line: typedef
  intialize(): void;

   uiState: Observable<UIState>;

  startAction(message?: string): void;

  endAction(message?: string, status?: UIStateStatusCode|any): void;

  resetState(): void;
}