import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { DynamicFormInterface } from "../../../core/compact";

export interface FormsLoaderInterface {
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
  ): Observable<DynamicFormInterface[]>;
}

/**
 * Abstract forms loader token
 */
export const DYNAMIC_FORM_LOADER = new InjectionToken<FormsLoaderInterface>("Provides a dynamic form loader");
