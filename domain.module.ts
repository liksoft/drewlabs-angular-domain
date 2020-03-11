import { PositiveNumber } from './pipes/positive-amount.pipe';
import { NgModule } from '@angular/core';
import { WindowRef, Dialog } from './utils/window-ref';
import { StorageModule } from './storage';
import { AuthTokenModule } from './auth-token';
import { AppHttpModule } from './http';
import { AuthModule } from './auth';
import { CoreComponentModule } from './components/core-components.module';
import { AmountFormatterPipe } from './pipes/amount-formatter.pipe';
import { ParseDatePipe, ParseMonthPipe, TimeAgoPipe } from './pipes/parse-date.pipe';
import { CheckScriptsPipe } from './pipes/safe-web-content.pipe';
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
    TranslateModule
  ],
  exports: [
    StorageModule,
    AuthTokenModule,
    AppHttpModule,
    AuthModule,
    CoreComponentModule,
    AmountFormatterPipe,
    ParseDatePipe,
    ParseMonthPipe,
    TimeAgoPipe,
    CheckScriptsPipe,
    SortableDirective,
    TranslateModule,
    DrewlabsDisableControlDirective,
    PositiveNumber
  ],
  declarations: [
    AmountFormatterPipe,
    ParseDatePipe,
    ParseMonthPipe,
    TimeAgoPipe,
    CheckScriptsPipe,
    SortableDirective,
    DrewlabsDisableControlDirective,
    PositiveNumber
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
