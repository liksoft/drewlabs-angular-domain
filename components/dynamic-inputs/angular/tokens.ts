import { InjectionToken } from '@angular/core';
import { FormsClient } from '../core';
import { AngularReactiveFormBuilderBridge } from './types';

export const FORM_CLIENT = new InjectionToken<FormsClient>(
  'FORM CLIENT FOR LOADING FORM THE DATA SOURCE'
);

export const ANGULAR_REACTIVE_FORM_BRIDGE =
  new InjectionToken<AngularReactiveFormBuilderBridge>(
    'PROVIDE AN INSTANCE THAT CREATE ANGULAR REACTIVE FORM ELEMENT FROM A FORM CONFIG'
  );

export const API_BINDINGS_ENDPOINT = new InjectionToken<string>(
  'API ENDPOINT FOR APPLICATION CONTROLS BINDINGS'
);

export const API_HOST = new InjectionToken<string>(
  'API HOST FOR FORM MANAGEMENT'
);
