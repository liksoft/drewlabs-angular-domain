import { InjectionToken } from "@angular/core";
import { FormsClient } from "../../core";
import { AngularReactiveFormBuilderBridge } from "../contracts";

export const FORM_CLIENT = new InjectionToken<FormsClient>(
  "FORM CLIENT FOR LOADING FORM THE DATA SOURCE"
);

export const ANGULAR_REACTIVE_FORM_BRIDGE =
  new InjectionToken<AngularReactiveFormBuilderBridge>(
    "PROVIDE AN INSTANCE THAT CREATE ANGULAR REACTIVE FORM ELEMENT FROM A FORM CONFIG"
  );
