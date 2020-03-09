import { Pipe, PipeTransform } from '@angular/core';
import { AmountFormatter } from '../utils/formatters';
import { isDefined } from '../utils/type-utils';

@Pipe({
  name: 'amountFormatter'
})
export class AmountFormatterPipe implements PipeTransform {
  transform(value: any, decimal: any | number = 0, seperator: string = ' '): any {
    if (!isDefined(value)) {
      return '0.00';
    }
    return AmountFormatter.formatBalance(value, decimal, seperator);
  }
}
