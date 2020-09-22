import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountFormaterPipe, FormatAmountPipe, PositiveNumber } from './numbers-formats.pipe';
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
    AmountFormaterPipe
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
    AmountFormaterPipe
  ]
})
export class CustomPipesModule {}
