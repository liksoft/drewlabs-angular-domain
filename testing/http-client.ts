import { createSubject } from '../rxjs/helpers';
import { observableOf } from '../rxjs/helpers';
import { isObservable } from '../rxjs/helpers/index';
import { HttpErrorResponse } from '@angular/common/http';
import { asyncError } from './testing';
import { Client, HTTPErrorState } from '../http/contracts';

export class HttpClientStub implements Partial<Client>
{
  // tslint:disable-next-line: variable-name
  private _errorState$ = createSubject<HTTPErrorState>();
  errorState$ = this._errorState$.asObservable();

  constructor(private returnedValue?: any) { }

  public setReturnValue(value: any) {
    this.returnedValue = value;
    return this;
  }

  post(
    path: string,
    body: any,
    options?: any) {
    if (this.returnedValue === 'error') {
      return asyncError(new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      }));
    }
    return isObservable(this.returnedValue) ? this.returnedValue : observableOf(this.returnedValue);
  }
}
