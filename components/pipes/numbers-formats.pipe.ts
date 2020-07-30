import { Pipe, PipeTransform } from '@angular/core';
import { AmountFormatter } from '../../utils/formatters';
import { isDefined } from '../../utils/types/type-utils';

@Pipe({
  name: 'formatAmount'
})
export class FormatAmountPipe implements PipeTransform {
  transform(value: any, decimal: any | number = 0, seperator: string = ' '): any {
    if (!isDefined(value)) {
      return '0.00';
    }
    return AmountFormatter.formatBalance(value, decimal, seperator);
  }
}


@Pipe({name: 'positiveNumber'})

export class PositiveNumber implements PipeTransform {
    transform(value: number): number {
      return Math.abs(value);
    }
}
