import { NgModule } from '@angular/core';
import { WindowRef, Dialog } from './utils/window-ref';
import { StorageModule } from './storage';
import { AuthTokenModule } from './auth-token';
import { AppHttpModule } from './http';
import { AuthModule } from './auth';
// import { DynamicFormControlModule } from './components/dynamic-inputs/dynamic-form-control';
import { CoreComponentModule } from './components/core-components.module';
import { AmountFormatterPipe } from './pipes/amount-formatter.pipe';
import { ParseDatePipe, ParseMonthPipe, TimeAgoPipe } from './pipes/parse-date.pipe';
import { SafeWebContentPipe, CheckScriptsPipe } from './pipes/safe-web-content.pipe';

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
    CheckScriptsPipe
  ],
  declarations: [
    AmountFormatterPipe,
    ParseDatePipe,
    ParseMonthPipe,
    TimeAgoPipe,
    SafeWebContentPipe,
    CheckScriptsPipe
  ],
  providers: [WindowRef, Dialog]
})
export class DomainModule {}
