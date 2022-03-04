import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import { MonthProvider } from '../../utils/datetime/months';
import { isDefined } from '../../utils/types/type-utils';

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return !isDefined(value) ? '' : (moment.isDate(new Date(value)) ?  moment(value).format(args ? args : 'DD/MM/YYYY') : value);
  }

}

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return !isDefined(value) ? '' : (moment.isDate(new Date(value)) ?  moment(value).format(args ? args : 'lll') : value);
  }

}

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: moment.MomentInput): any {
    return !isDefined(value) ? '' : (moment.isDate(value) ?  moment(value).fromNow() : value);
  }

}


@Pipe({
  name: 'parseMonth'
})
export class ParseMonthPipe implements PipeTransform {

  transform(value: any): any {
    return !isDefined(value) ? '' : MonthProvider.parseMonth(value);
  }

}
