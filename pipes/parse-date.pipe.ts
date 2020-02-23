import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import { MonthProvider } from '../utils/months';
import { isDefined } from '../utils/type-utils';

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!isDefined(value)) {
      return '';
    }
    return moment.isDate(new Date(value)) ?  moment(new Date(value)).format(args ? args : 'DD/MM/YYYY') : value;
  }

}

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): any {
    if (!isDefined(value)) {
      return '';
    }
    return moment.isDate(new Date(value)) ?  moment(new Date(value)).fromNow() : value;
  }

}


@Pipe({
  name: 'parseMonth'
})
export class ParseMonthPipe implements PipeTransform {

  transform(value: any): any {
    return MonthProvider.parseMonth(value);
  }

}
