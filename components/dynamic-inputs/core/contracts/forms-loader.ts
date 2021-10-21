import { Observable } from "rxjs";
import { FormInterface } from "../compact";

export interface FormsLoader {
  /**
   * Provides an abstraction for loading dynamic form definitions
   * from an asset configuration file, a remote server
   *
   * @param endpoint
   * @param options
   */
  load(
    endpoint: string,
    options?: { [index: string]: any }
  ): Observable<FormInterface[]>;
}
