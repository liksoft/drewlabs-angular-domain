import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthTokenService } from '../core/auth-token.service';
import { AuthRememberTokenService } from '../core';

interface AuthModuleConfigInterface {
  rememberTokenStorageKeyName?: string;
  authUserStorageKeyName?: string;
  oauthTokenStorageKeyName?: string;
}

@NgModule()
export class AuthTokenModule {
  static forRoot(configs: AuthModuleConfigInterface): ModuleWithProviders<AuthTokenModule> {
    return {
      ngModule: AuthTokenModule,
      providers: [
        AuthTokenService,
        AuthRememberTokenService,
        {
          provide: 'DREWLABS_USER_REMEMBER_TOKEN_KEY',
          useValue: configs.rememberTokenStorageKeyName || 'X_Auth_Remember_Token'
        },
        {
          provide: 'DREWLABS_USER_ID_KEY',
          useValue: configs.authUserStorageKeyName || 'X_Auth_User_Id'
        },
        {
          provide: 'DREWLABS_USER_TOKEN_KEY',
          useValue: configs.oauthTokenStorageKeyName || 'X_Auth_Token'
        }
      ]
    };
  }
}
