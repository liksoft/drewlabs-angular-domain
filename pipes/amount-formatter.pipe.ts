import { Pipe, PipeTransform } from '@angular/core';
import { AmountFormatter } from '../utils/formatters';

@Pipe({
  name: 'amountFormatter'
})
export class AmountFormatterPipe implements PipeTransform {
  transform(value: any, decimal: any | number = 0, seperator: string = ' '): any {
    return AmountFormatter.formatBalance(value, decimal, seperator);
  }
}
