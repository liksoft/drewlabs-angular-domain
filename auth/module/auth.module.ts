import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from '../core/auth-guard.service';
import { AuthService } from '../core/auth.service';
import { AuthUserService } from '../core/user.service';
import { Roleservice } from '../core/services/roles.service';
import { ApplicationUsersService } from '../core/services/users.service';
import { PermissionsService } from '../core/services/permissions.service';
import { Departmentservice } from '../core/services/department.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthGuardService,
        AuthService,
        AuthUserService,
        PermissionsService,
        Roleservice,
        ApplicationUsersService,
        Departmentservice
      ],
    };
  }
}
