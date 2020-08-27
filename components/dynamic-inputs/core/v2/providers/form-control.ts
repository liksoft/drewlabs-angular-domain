import { createStore } from '../../../../../rxjs/state/rx-state';
import { Observable } from 'rxjs';
import { controlsReducer } from '../reducers';
import { FormControlState } from '../actions';
import { Injectable } from '@angular/core';

const initialState: FormControlState = {
  items: [],
  createdControl: null,
  performingAction: false,
  error: null,
  updateResult: null,
  deleteResult: null
};

@Injectable({
  providedIn: 'root'
})
export class FormControlsProvider {
  public readonly store$ = createStore(controlsReducer, initialState);
  // tslint:disable-next-line: typedef
  get state$(): Observable<FormControlState> {
    return this.store$.connect();
  }
}
