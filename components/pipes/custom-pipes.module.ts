import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountamountFormaterPipe, AmountFormaterPipe, FormatAmountPipe, ParseInt, PositiveNumber } from './numbers-formats.pipe';
import { ParseDatePipe, TimeAgoPipe, ParseMonthPipe, DateTimePipe } from './parse-date.pipe';
import { SafeWebContentPipe, SafeRessourceContentPipe, CheckScriptsPipe } from './safe-web-content.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FormatAmountPipe,
    TimeAgoPipe,
    ParseDatePipe,
    ParseMonthPipe,
    PositiveNumber,
    SafeWebContentPipe,
    SafeRessourceContentPipe,
    CheckScriptsPipe,
    DateTimePipe,
    AmountFormaterPipe,
    ParseInt,
    AccountamountFormaterPipe
  ],
  exports: [
    FormatAmountPipe,
    TimeAgoPipe,
    ParseDatePipe,
    ParseMonthPipe,
    PositiveNumber,
    SafeWebContentPipe,
    SafeRessourceContentPipe,
    CheckScriptsPipe,
    DateTimePipe,
    AmountFormaterPipe,
    ParseInt,
    AccountamountFormaterPipe
  ]
})
export class CustomPipesModule {}
