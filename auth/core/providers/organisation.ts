import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { companiesReducer } from '../reducers';
import { createStore } from '../../../rxjs/state/rx-state';
import { initialCompaniesState, CompaniesState } from '../actions/organisation';

@Injectable({
  providedIn: 'root'
})
export class CompaniesProvider implements OnDestroy {

  public readonly store$ = createStore(companiesReducer, initialCompaniesState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<CompaniesState> {
    return this.store$.connect();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    // resetCompaniesStore(this.store$)();
    this.store$.destroy();
  }
}
