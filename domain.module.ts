import { NgModule } from '@angular/core';
import { WindowRef, Dialog } from './utils/window-ref';
import { StorageModule } from './storage';
import { AuthTokenModule } from './auth-token';
import { AppHttpModule } from './http';
import { AuthModule } from './auth';
import { CoreComponentModule } from './components/core-components.module';
import { SortableDirective } from './directives/sortable.directive';
import { TranslationService } from './translator';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DrewlabsDisableControlDirective } from './directives/disable-control.directive';
import { FormHelperService } from './helpers/form-helper';
import { TypeUtilHelper } from './helpers/type-utils-helper';
import { TranslatorHelperService } from './helpers/translator-helper';
import { FileHelperService } from './helpers/file-helper.service';
import { DateTimeHelper } from './helpers/date-time-helper';
import { DatagridHeaderModule } from './components/datgrid-header/datagrid-header.module';
import { PipesModule } from './pipes';
import { AlertablePageComponent, PageComponent } from './helpers/component-interfaces';
import { DynamicFormPageComponent } from './helpers/component-reactive-form-helpers';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../../../assets/i18n/', '.json');
}

@NgModule({
  imports: [
    StorageModule.forRoot(),
    AuthTokenModule.forRoot(),
    AppHttpModule.forRoot(),
    AuthModule.forRoot(),
    CoreComponentModule.forRoot(),
    TranslateModule,
    DatagridHeaderModule,
    PipesModule
  ],
  exports: [
    StorageModule,
    AuthTokenModule,
    AppHttpModule,
    AuthModule,
    CoreComponentModule,
    // CheckScriptsPipe,
    SortableDirective,
    TranslateModule,
    DrewlabsDisableControlDirective,
    DatagridHeaderModule,
    PipesModule
  ],
  declarations: [
    // CheckScriptsPipe,
    SortableDirective,
    DrewlabsDisableControlDirective,
    AlertablePageComponent,
    DynamicFormPageComponent,
    PageComponent
  ],
  providers: [
    WindowRef,
    Dialog,
    TranslationService,
    FormHelperService,
    TypeUtilHelper,
    TranslatorHelperService,
    FileHelperService,
    DateTimeHelper
  ]
})
export class DomainModule {}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ApplicationTranslationModule {}
