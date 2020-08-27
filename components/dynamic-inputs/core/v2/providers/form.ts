import { PaginationData } from '../../../../../pagination/types';
import { createStore } from '../../../../../rxjs/state/rx-state';
import { FormState } from '../actions';
import { FormV2 } from '../models/form';
import { formsReducer } from '../reducers';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const initialState: FormState = {
  items: [],
  pagination: {} as PaginationData<FormV2>,
  selectedFormId: null,
  createdForm: null,
  performingAction: false,
  error: null,
  updateResult: null,
  deleteResult: null
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
