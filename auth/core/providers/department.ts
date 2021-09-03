import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { departmentsReducer } from '../reducers';
import { createStore } from '../../../rxjs/state/rx-state';
import { initialDepartmentsState, DepartmentV2sState } from '../actions/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsProvider implements OnDestroy {

  public readonly store$ = createStore(departmentsReducer, initialDepartmentsState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<DepartmentV2sState> {
    return this.store$.connect();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    // resetDepartmentsStore(this.store$)();
    this.store$.destroy();
  }
}
