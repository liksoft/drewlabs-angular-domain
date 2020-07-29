import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardService, PermissionsGuardGuard, RootComponentGuard } from '../core/auth-guard.service';
import { AuthUserService } from '../core/user.service';
import { UserStorageProvider } from '../core/services/user-storage';
import { GenericUndecoratedSerializaleSerializer } from '../../built-value/core/js/serializer';
import { AppUser, IAppUser } from '../contracts/v2/user/user';
import { IGenericSerializableBuilder, ISerializableBuilder } from '../../built-value/contracts';
import { AuthInterceptorService } from '../core/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export type AuthModuleConfigs = { userSerializer?: IGenericSerializableBuilder<IAppUser> | ISerializableBuilder<IAppUser> };
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
        PermissionsGuardGuard,
        RootComponentGuard,
        AuthGuardService,
        AuthUserService,
        UserStorageProvider,
        // AuthService
      ],
    };
  }
}
