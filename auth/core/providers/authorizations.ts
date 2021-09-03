import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { authorizationsReducer } from '../reducers';
import { createStore } from '../../../rxjs/state/rx-state';
import { initialAuthorizationsState, resetAuthorizationsStore, AuthorizationsState } from '../actions/authorizations';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationsProvider implements OnDestroy {

  public readonly store$ = createStore(authorizationsReducer, initialAuthorizationsState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<AuthorizationsState> {
    return this.store$.connect();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    // resetAuthorizationsStore(this.store$)();
    this.store$.destroy();
  }
}
