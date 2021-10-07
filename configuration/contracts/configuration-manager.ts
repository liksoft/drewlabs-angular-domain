import { Observable } from "rxjs";

export interface ConfigurationManager {
  // Cette method charge en mémoire les configurations de l'application
  load(
    configuration?: { [index: string]: any } | string
  ): void | Observable<any>;
  // {[index: string]: any} -> object -> any
  // {[value: string]: any} -> object

  // Cette method récupère une valeur correspodante à la clé fourni
  get(key?: string, default_?: any): any;
}
