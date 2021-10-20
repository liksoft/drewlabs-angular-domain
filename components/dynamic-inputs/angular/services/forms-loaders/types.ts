import { InjectionToken } from "@angular/core";
import { FormsLoader } from "../../../core";

/**
 * Abstract forms loader token
 */
export const DYNAMIC_FORM_LOADER = new InjectionToken<FormsLoader>(
  "Provides a dynamic form loader"
);
