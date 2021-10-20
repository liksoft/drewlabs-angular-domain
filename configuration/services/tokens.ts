import { InjectionToken } from "@angular/core";
import { ConfigurationManager } from "../contracts/configuration";

export const ENVIRONMENT = new InjectionToken<{ [index: string]: any }>(
  'Angular enviromenent'
);

// Permet d'injecter les types dans le gestionnaire des dépendances
// Tout ce qui est type : Interface, ou tout type dy langage Typescript (number, string, { [index: string]: any })
export const ANGULAR_ENVIRONMENT_MANAGER = new InjectionToken<ConfigurationManager>(
  'Injectable instance of AngularEnvironmentService'
);

export const JSON_CONFIG_URL =new InjectionToken<string>(
  'Json configuration url'
);

export const JSON_CONFIG_MANAGER = new InjectionToken<ConfigurationManager>(
  'Injectable instance of Json configuration Manager'
);

export const CONFIG_MANAGER  = new InjectionToken<ConfigurationManager>(
  'Injectable instance of configuration manager'
);
