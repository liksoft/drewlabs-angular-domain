import * as moment from 'moment';
import { isDefined } from './type-utils';

export class DateTimeUtils {
  /**
   * @description Add date unit to a given date
   * @param currentDate [[Date]]
   * @param value [[moment.DurationInputArg1]]
   * @param key [[moment.unitOfTime.DurationConstructor]]
   */
  public static add(
    currentDate: Date,
    value?: moment.DurationInputArg1,
    key?: moment.unitOfTime.DurationConstructor
  ): Date {
    return moment(currentDate)
      .add(value, key)
      .toDate();
  }

  /**
   * @description Substract date unit from a given date
   * @param currentDate [[Date]]
   * @param value [[moment.DurationInputArg1]]
   * @param key [[moment.unitOfTime.DurationConstructor]]
   */
  public static substract(
    currentDate: Date,
    value: moment.DurationInputArg1,
    key?: moment.unitOfTime.DurationConstructor
  ): Date {
    return moment(currentDate)
      .subtract(value, key)
      .toDate();
  }
  /**
   * Check if the first date is after the other date
   * @param date1 [[Date|string]] First date to compare
   * @param date2 [[Date|string]] Other date
   */
  public static isAfter(date1: Date|string, date2: Date|string): boolean {
    const firstDate = DateTimeUtils.ensureDate(date1);
    const secondDate = DateTimeUtils.ensureDate(date2);
    return moment(firstDate).diff(moment(secondDate)) <= 0 ? false : true;
  }

  /**
   * Check if the first date is before the other date
   * @param date1 [[Date|string]] First date to compare
   * @param date2 [[Date|string]] Other date
   */
  public static isBefore(date1: Date|string, date2: Date|string): boolean {
    const firstDate = DateTimeUtils.ensureDate(date1);
    const secondDate = DateTimeUtils.ensureDate(date2);
    return moment(firstDate).diff(moment(secondDate)) >= 0 ? false : true;
  }

  /**
   * Checks if date provided is a valid date
   * @param date [[Date]]
   */
  public static isValidDate(date: Date) {
    return moment.isDate(date);
  }

  /**
   * Parse a user provided date to a given format or default
   * @param date [[Date|string]]
   * @param format [[string]] returned date format
   */
  public static parseDate(date: Date | string, format = 'DD/MM/YYYY') {
    if (date instanceof Date) {
      return moment(date).format(format);
    }
    return moment(date).format(format);
  }

  protected static ensureDate(date: string|Date) {
    try {
      if (!(date instanceof Date)) {
        return moment(date).format('YYYY-MM-DD');
      }
      return date;
    } catch (error) {
      throw Error('Invalid date input');
    }
  }

  /**
   * @description Return the current date as a javascript date object if no parameter
   * is passed or a formatted date string based on the parameter
   * @param format [[string]]
   */
  public static now(format: string = null) {
    return moment().format(format);
  }
}
