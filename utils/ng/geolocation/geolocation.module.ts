import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { GeolocationComponent } from "./directives/geolocation.component";
import {
  GeolocationService,
  GeolocationInterceptorService,
  GEOLOCATION_MANAGER,
} from "./service/geolocation.service";

@NgModule({
  declarations: [GeolocationComponent],
  exports: [GeolocationComponent],
  imports: [CommonModule],
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
