import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { rolesReducer } from '../reducers';
import { createStore } from '../../../rxjs/state/rx-state';
import { initialRolesState, RolesState } from '../actions/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesProvider implements OnDestroy {

  public readonly store$ = createStore(rolesReducer, initialRolesState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<RolesState> {
    return this.store$.connect();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    // resetRolesStore(this.store$)();
    this.store$.destroy();
  }
}
