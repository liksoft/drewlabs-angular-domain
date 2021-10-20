import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { getJSObjectPropertyValue } from "../../utils";
import { ConfigurationManager } from "../contracts/configuration";
import { ANGULAR_ENVIRONMENT_MANAGER, JSON_CONFIG_URL } from "./tokens";

@Injectable({
  providedIn: "root",
})
export class AppConfigurationManager implements ConfigurationManager {
  _enviroment: { [index: string]: any } = {};
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
    return this._client.get(url || this._url, {}).pipe(
      tap((state) => {
        this._configuration = {
          ...(this._enviroment || {}),
          ...(state || {}),
        };
      }),
      catchError((err) => {
        this._configuration = this._enviroment || {};
        return throwError(err);
      })
    );
  }

  get(key: string | undefined = undefined, default_: any = undefined) {
    if (key) {
      return (
        getJSObjectPropertyValue(this._configuration ?? {}, key) ??
        default_ ??
        undefined
      );
    }
    return this._configuration ?? {};
  }
}
