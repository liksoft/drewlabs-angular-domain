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
    lastPage: null,
    nextPageURL: null,
    lastPageURL: null
  },
  selectedFormId: null,
  currentForm: null,
  performingAction: false,
  error: null,
  createResult: null,
  updateResult: null,
  deleteResult: null,
  createControlResult: null,
  updateControlResult: null,
  deleteControlResult: null,
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
