import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthTokenService } from '../core/auth-token.service';
import { AuthRememberTokenService } from '../core';
@NgModule({
  providers: []
})
export class AuthTokenModule {
  static forRoot(): ModuleWithProviders<AuthTokenModule> {
    return {
      ngModule: AuthTokenModule,
      providers: [
        AuthTokenService,
        AuthRememberTokenService
      ]
    };
  }
}
