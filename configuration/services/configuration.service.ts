import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { JSObject } from "../../utils";
import { ConfigurationManager } from "../contracts/configuration";
import { ANGULAR_ENVIRONMENT_MANAGER, JSON_CONFIG_URL } from "./tokens";

@Injectable({
  providedIn: "root",
})
export class AppConfigurationManager implements ConfigurationManager {
  private enviroment_: { [index: string]: any } = {};
  private configuration_: { [index: string]: any } = {};

  constructor(
    private _client: HttpClient,
    @Inject(JSON_CONFIG_URL) @Optional() private _url: string,
    @Inject(ANGULAR_ENVIRONMENT_MANAGER)
    @Optional()
    ngEnviromentManager?: ConfigurationManager
  ) {
    this.enviroment_ = ngEnviromentManager?.get();
  }

  load(url?: string) {
    return this._client.get(url ?? this._url, {}).pipe(
      tap((state) => {
        this.configuration_ = {
          ...(this.enviroment_ || {}),
          ...(state ?? {}),
        };
      }),
      catchError((err) => {
        this.configuration_ = this.enviroment_ ?? {};
        return throwError(err);
      })
    );
  }

  get(key: string | undefined = undefined, default_: any = undefined) {
    if (key) {
      return (
        JSObject.getProperty(this.configuration_ ?? {}, key) ??
        default_ ??
        undefined
      );
    }
    return this.configuration_ ?? {};
  }
}
