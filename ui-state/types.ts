import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export class UIStateStatusCode {
  /**
   * @deprecated
   */
  static readonly STATUS_OK = 200;
  /**
   * @deprecated
   */
  static readonly STATUS_CREATED = 201;
  /**
   * @deprecated
   */
  static readonly BAD_REQUEST = 422;
  /**
   * @deprecated
   */
  static readonly WARNING = 422;

  static readonly UNAUTHORIZED = 401;
  static readonly AUTHENTICATED = 202;
  static readonly UNAUTHENTICATED = 403;
  static readonly BAD = 422 || 400;
  static readonly OK = 200 || 201;
  static readonly ERROR = 500;
}

export interface UIState {
  performingAction: boolean;
  uiMessage?: string;
  hasError?: boolean;
  status?: number;
}

export interface UIStateProvider {
  uiState: Observable<UIState>;

  startAction(message?: string): void;

  endAction(message?: string, status?: UIStateStatusCode | any): void;

  resetState(): void;
}

/**
 * @description Provider for the UI state service
 * @var UIStateProvider
 */
export const UI_STATE_PROVIDER = new InjectionToken<UIStateProvider>(
  'UI State Provider'
);
