import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { AppUsersState, initialUsersState } from '../actions/app-users';
import { usersReducer } from '../reducers';
import { createStore } from '../../../rxjs/state/rx-state';

@Injectable({
  providedIn: 'root'
})
export class UsersProvider implements OnDestroy {

  public readonly store$ = createStore(usersReducer, initialUsersState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<AppUsersState> {
    return this.store$.connect();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy = () => {
    // resetUserStore(this.store$)();
    this.store$.destroy();
  }
}
