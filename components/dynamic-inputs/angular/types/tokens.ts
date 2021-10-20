import { InjectionToken } from "@angular/core";
import { FormsProvider } from "../../core";
import { FormsClient } from "../../core";
import { AngularReactiveFormBuilderBridge } from "../contracts";

export const FORM_CLIENT = new InjectionToken<FormsClient>(
  "FORM CLIENT FOR LOADING FORM THE DATA SOURCE"
);

export const FORMS_PROVIDER = new InjectionToken<FormsProvider>(
  "FORM PROVIDER INSTANCE FOR MANIPULATION FORMS AND IT CONTROL"
);

export const ANGULAR_REACTIVE_FORM_BRIDGE =
  new InjectionToken<AngularReactiveFormBuilderBridge>(
    "PROVIDE AN INSTANCE THAT CREATE ANGULAR REACTIVE FORM ELEMENT FROM A FORM CONFIG"
  );
