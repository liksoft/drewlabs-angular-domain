import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigurationManager } from '../contracts/configuration-manager';
import { getJSObjectPropertyValue } from './helpers';
import { ANGULAR_ENVIRONMENT_MANAGER, JSON_CONFIG_URL } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class JSONConfigurationManager implements ConfigurationManager {
  _enviroment: { [index: string]: any } =  {};
  _configuration: { [index: string]: any } = {};

  constructor(
    private _client: HttpClient,
    @Inject(JSON_CONFIG_URL) @Optional() private _url: string,
    @Inject(ANGULAR_ENVIRONMENT_MANAGER)
    @Optional()
    ngEnviromentManager?: ConfigurationManager
  ) {
    this._enviroment = ngEnviromentManager?.get();
  }

  load(url?: string) {
    return this._client
      .get(url || this._url , {})
      .pipe(
        tap((state) => {
          this._configuration = {
            ...(this._enviroment || {}),
            ...(state || {}),
          };
        }),
      );
  }

  get(key: string | undefined = undefined, default_: any = undefined) {
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
