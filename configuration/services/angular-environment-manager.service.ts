import { Inject, Injectable, Optional } from '@angular/core';
import { ConfigurationManager } from '../contracts/configuration-manager';
import { getJSObjectPropertyValue } from './helpers';
import { ENVIRONMENT } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class AngularEnvironmentService implements ConfigurationManager {
  private _configuration: { [index: string]: any } = {};

  constructor(
    @Inject(ENVIRONMENT) @Optional() configuration?: { [index: string]: any }
  ) {
    this._configuration = configuration || {};
  }

  load(configuration?: { [index: string]: any }): void {
    this._configuration = configuration || {};
  }

  get(key: string|undefined = undefined, default_: any = undefined) {
    if (key) {
      return (
        getJSObjectPropertyValue(this._configuration || {}, key) ||
        default_ ||
        undefined
      );
    }
    return this._configuration || {};
  }
}