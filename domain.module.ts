import { NgModule } from '@angular/core';
import { WindowRef, Dialog } from './utils/window-ref';
import { StorageModule } from './storage';
import { AuthTokenModule } from './auth-token';
import { AppHttpModule } from './http';
import { AuthModule } from './auth';
import { CoreComponentModule } from './components/core-components.module';
import { AmountFormatterPipe } from './pipes/amount-formatter.pipe';
import { ParseDatePipe, ParseMonthPipe, TimeAgoPipe } from './pipes/parse-date.pipe';
import { SafeWebContentPipe, CheckScriptsPipe } from './pipes/safe-web-content.pipe';
import { SortableDirective } from './directives/sortable.directive';
import { TranslationService } from './translator';

@NgModule({
  imports: [
    StorageModule.forRoot(),
    AuthTokenModule.forRoot(),
    AppHttpModule.forRoot(),
    AuthModule.forRoot(),
    // DynamicFormControlModule,
    CoreComponentModule.forRoot()
  ],
  exports: [
    StorageModule,
    AuthTokenModule,
    AppHttpModule,
    AuthModule,
    // DynamicFormControlModule,
    CoreComponentModule,
    AmountFormatterPipe,
    ParseDatePipe,
    ParseMonthPipe,
    TimeAgoPipe,
    SafeWebContentPipe,
    CheckScriptsPipe,
    SortableDirective
  ],
  declarations: [
    AmountFormatterPipe,
    ParseDatePipe,
    ParseMonthPipe,
    TimeAgoPipe,
    SafeWebContentPipe,
    CheckScriptsPipe,
    SortableDirective
  ],
  providers: [WindowRef, Dialog, TranslationService]
})
export class DomainModule {}
