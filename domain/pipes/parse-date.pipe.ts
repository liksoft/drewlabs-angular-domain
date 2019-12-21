import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import { MonthProvider } from '../utils/months';

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment.isDate(new Date(value)) ?  moment(new Date(value)).format(args ? args : 'DD/MM/YYYY') : value;
  }

}

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): any {
    moment.locale('fr');
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
