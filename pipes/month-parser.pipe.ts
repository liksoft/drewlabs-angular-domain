import { Pipe, PipeTransform } from '@angular/core';
import { isDefined } from '../utils/type-utils';
import { MonthProvider } from 'src/app/lib/domain/utils/months';

@Pipe({
  name: 'monthParser'
})
export class MonthParserPipe implements PipeTransform {
  transform(value: any): any {
    if (!isDefined(value)) {
      return '';
    }
    return MonthProvider.parseMonth(value);
  }
}
