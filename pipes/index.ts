import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountFormatterPipe } from './amount-formatter.pipe';
import { MonthParserPipe } from './month-parser.pipe';
import { ParseDatePipe, TimeAgoPipe, ParseMonthPipe } from './parse-date.pipe';
import { PositiveNumber } from './positive-amount.pipe';
import { SafeWebContentPipe, SafeRessourceContentPipe, CheckScriptsPipe } from './safe-web-content.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AmountFormatterPipe,
    MonthParserPipe,
    ParseDatePipe,
    TimeAgoPipe,
    ParseMonthPipe,
    PositiveNumber,
    SafeWebContentPipe,
    SafeRessourceContentPipe,
    CheckScriptsPipe
  ],
  exports: [
    AmountFormatterPipe,
    MonthParserPipe,
    ParseDatePipe,
    TimeAgoPipe,
    ParseMonthPipe,
    PositiveNumber,
    SafeWebContentPipe,
    SafeRessourceContentPipe,
    CheckScriptsPipe
  ]
})
export class PipesModule { }
