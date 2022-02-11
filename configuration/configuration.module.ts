import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigurationManager } from "./contracts/configuration";
import { EnvironmentService } from "./services/environment.service";
import { AppConfigurationManager } from "./services/configuration.service";
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  CONFIG_MANAGER,
  ENVIRONMENT,
  JSON_CONFIG_URL,
} from "./services/tokens";

export const appInitialization = (manager: ConfigurationManager) => {
  return async () => {
    return await (manager.load() as Observable<any>).toPromise();
  };
};

interface ModuleConfig {
  environment: { [index: string]: any };
  jsonConfigURL?: string;
}

@NgModule({})
export class ConfigurationModule {
  static forRoot(
    config: ModuleConfig
  ): ModuleWithProviders<ConfigurationModule> {
    return {
      ngModule: ConfigurationModule,
      providers: [
        {
          provide: ANGULAR_ENVIRONMENT_MANAGER,
          useClass: EnvironmentService,
        },
        {
          provide: CONFIG_MANAGER,
          useClass: AppConfigurationManager,
        },
        {
          provide: ENVIRONMENT,
          useValue: config.environment,
        },
        {
          provide: JSON_CONFIG_URL,
          useValue: config.jsonConfigURL || "/assets/resources/config.json",
        },
        {
          // APP_INITIALIZER est un token du framework angular permettant d'excécuter une
          // fonction async à l'initialisation du framework lui même
          provide: APP_INITIALIZER,
          useFactory: (manager: ConfigurationManager) =>
            appInitialization(manager),
          multi: true,
          deps: [CONFIG_MANAGER],
        },
      ],
    };
  }
}
