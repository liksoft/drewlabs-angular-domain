import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardService, AuthorizationsGuard, RootComponentGuard } from '../core/auth-guard.service';
import { UserStorageProvider } from '../core/services/user-storage';
import { GenericUndecoratedSerializaleSerializer } from '../../built-value/core/js/serializer';
import { AppUser, IAppUser } from '../contracts/v2/user/user';
import { IGenericSerializableBuilder, ISerializableBuilder } from '../../built-value/contracts';
import { AuthInterceptorService } from '../core/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DrewlabsV2LoginResultHandlerFunc } from '../../rxjs/operators';
import { MapToHandlerResponse } from '../../rxjs/types';

export interface AuthModuleConfigs {
  userSerializer?: IGenericSerializableBuilder<IAppUser> | ISerializableBuilder<IAppUser>;
  loginResponseHandler: MapToHandlerResponse<any>;
}
@NgModule({
  imports: [
    CommonModule
  ]
})
export class AuthModule {
  static forRoot(config?: AuthModuleConfigs): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: 'USER_SERIALIZER',
          useValue: config ? config.userSerializer || (new GenericUndecoratedSerializaleSerializer<AppUser>())
            : (new GenericUndecoratedSerializaleSerializer<AppUser>())
        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        RootComponentGuard,
        AuthGuardService,
        UserStorageProvider,
        AuthorizationsGuard,
        {
          provide: 'LOGIN_RESPONSE_HANDLER_FUNC',
          useValue: config.loginResponseHandler || DrewlabsV2LoginResultHandlerFunc
        }
      ],
    };
  }
}
