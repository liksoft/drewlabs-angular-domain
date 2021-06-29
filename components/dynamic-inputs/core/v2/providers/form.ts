import { createStore } from '../../../../../rxjs/state/rx-state';
import { FormState } from '../actions';
import { formsReducer } from '../reducers';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export const initialState: FormState = {
  collections: {
    currentPage: 1,
    total: 0,
    items: {},
    data: [],
    lastPage: undefined,
    nextPageURL: undefined,
    lastPageURL: undefined
  },
  selectedFormId: undefined,
  currentForm: undefined,
  performingAction: false,
  error: undefined,
  createResult: undefined,
  updateResult: undefined,
  deleteResult: undefined,
  createControlResult: undefined,
  updateControlResult: undefined,
  deleteControlResult: undefined,
};

@Injectable({
  providedIn: 'root'
})
export class FormsProvider {
  public readonly store$ = createStore(formsReducer, initialState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<FormState> {
    return this.store$.connect();
  }
}
