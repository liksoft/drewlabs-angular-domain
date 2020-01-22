import * as moment from 'moment';
import { isDefined } from './type-utils';

export class MomentUtils {
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
  public static isAfter(date1: Date | string, date2: Date | string): boolean {
    const firstDate = MomentUtils.parseDate(date1, 'YYYY-MM-DD');
    const secondDate = MomentUtils.parseDate(date2, 'YYYY-MM-DD');
    return moment(firstDate).diff(moment(secondDate)) <= 0 ? false : true;
  }

  /**
   * Check if the first date is before the other date
   * @param date1 [[Date|string]] First date to compare
   * @param date2 [[Date|string]] Other date
   */
  public static isBefore(date1: Date | string, date2: Date | string): boolean {
    const firstDate = MomentUtils.parseDate(date1, 'YYYY-MM-DD');
    const secondDate = MomentUtils.parseDate(date2, 'YYYY-MM-DD');
    return moment(firstDate).diff(moment(secondDate)) >= 0 ? false : true;
  }

  /**
   * Checks if date provided is a valid date
   * @param date [[Date]]
   */
  public static isValidDate(date: Date|string) {
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
    return moment(new Date(date)).format(format);
  }

  protected static ensureDate(date: any) {
    try {
      if (!(date instanceof Date)) {
        return new Date(date);
      }
      return date;
    } catch (error) {
      throw Error('Invalid date input');
    }
  }

  /**
   * @description Get the month part of a provided date
   * @param date [[Date|string]]
   */
  public static getMonth(date: Date|string) {
    return moment(new Date(date)).month();
  }

  /**
   * @description Get the month part of a provided date
   * @param date [[Date|string]]
   */
  public static getYear(date: Date|string) {
    return moment(new Date(date)).year();
  }
}
