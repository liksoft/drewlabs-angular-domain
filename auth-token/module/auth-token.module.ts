import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthTokenService } from '../core/auth-token.service';
@NgModule({
  providers: []
})
export class AuthTokenModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthTokenModule,
      providers: [
        AuthTokenService
      ]
    };
  }
}
