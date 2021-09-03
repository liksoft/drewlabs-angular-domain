import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import {
  GeolocationService,
  GeolocationInterceptorService,
  GEOLOCATION_MANAGER,
} from "./service/geolocation.service";

@NgModule({
  providers: [],
})
export class GeolocationModule {
  static forRoot(): ModuleWithProviders<GeolocationModule> {
    return {
      ngModule: GeolocationModule,
      providers: [
        {
          provide: GEOLOCATION_MANAGER,
          useClass: GeolocationService,
          // multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GeolocationInterceptorService,
          multi: true,
        },
      ],
    };
  }
}
