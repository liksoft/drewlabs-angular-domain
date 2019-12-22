import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../../auth/core/auth-interceptor.service';
import { HttpRequestService } from '../core/http-request.service';
import { AuthModule } from '../../auth';

@NgModule({
  imports: [
    HttpClientModule,
    AuthModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    HttpRequestService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ]
})
export class AppHttpModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppHttpModule,
      providers: [
        HttpRequestService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
      ]
    };
  }
}
