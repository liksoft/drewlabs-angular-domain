import * as moment from "moment";

export class MomentUtils {
  /**
   * @description Add date unit to a given date
   * @param currentDate [[Date]]
   * @param value [[moment.DurationInputArg1]]
   * @param key [[moment.unitOfTime.DurationConstructor]]
   */
  public static add(
    currentDate: Date | moment.Moment,
    value?: moment.DurationInputArg1,
    key?: moment.unitOfTime.DurationConstructor
  ): Date {
    return moment(currentDate).add(value, key).toDate();
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
    return moment(currentDate).subtract(value, key).toDate();
  }
  /**
   * Check if the first date is after the other date
   * @param date1 [[Date|string]] First date to compare
   * @param date2 [[Date|string]] Other date
   */
  public static isAfter(date1: Date | string, date2: Date | string): boolean {
    const firstDate = MomentUtils.parseDate(date1);
    const secondDate = MomentUtils.parseDate(date2);
    return moment(firstDate, this.longDateFormat()).isAfter(
      moment(secondDate, this.longDateFormat())
    );
  }

  /**
   * Check if the first date is before the other date
   * @param date1 [[Date|string]] First date to compare
   * @param date2 [[Date|string]] Other date
   */
  public static isBefore(date1: Date | string, date2: Date | string): boolean {
    const firstDate = MomentUtils.parseDate(date1);
    const secondDate = MomentUtils.parseDate(date2);
    return moment(firstDate, this.longDateFormat()).isBefore(
      moment(secondDate, this.longDateFormat())
    )
      ? true
      : false;
  }

  /**
   * Checks if date provided is a valid date
   * @param date [[Date]]
   */
  public static isValidDate(date: Date | string): boolean {
    return moment.isDate(date);
  }

  /**
   * Parse a user provided date to a given format or default
   * @param date [[Date|string]]
   * @param outputformat [[string]]
   * @param inputformat [[string]]
   */
  public static parseDate(
    date?: Date | string,
    outputformat?: string,
    inputformat?: string
  ): string {
    outputformat = outputformat
      ? outputformat
      : moment.localeData().longDateFormat("L");
    inputformat = inputformat
      ? inputformat
      : moment.localeData("en-gb").longDateFormat("L");
    const value = moment(date, inputformat).format(outputformat);
    return value;
  }

  protected static ensureDate(date: any): Date {
    try {
      if (!(date instanceof Date)) {
        return new Date(date);
      }
      return date;
    } catch (error) {
      throw Error("Invalid date input");
    }
  }

  /**
   * @description Get the month part of a provided date
   * @param date [[Date|string]]
   */
  public static getMonth(date: Date | string): number {
    return moment(date, this.longDateFormat()).month();
  }

  /**
   * @description Get the month part of a provided date
   * @param date [[Date|string]]
   */
  public static getYear(date: Date | string): number {
    return moment(date, this.longDateFormat()).year();
  }

  /**
   * Calculate the difference in a unit of time between a moment|date and now
   * @param date [[moment.MomentInput]]
   * @param interval [[moment.unitOfTime.DurationConstructor]]
   * @param precise [[boolean]]
   */
  public static diff(
    date: moment.MomentInput,
    interval: moment.unitOfTime.DurationConstructor,
    precise?: boolean
  ): number {
    return moment().diff(date, interval, precise);
  }

  /**
   * @description Return the current date as a javascript date object if no parameter
   * is passed or a formatted date string based on the parameter
   * @param format [[string]]
   */
  public static now(format?: string): moment.Moment {
    return moment(null, format);
  }

  /**
   * @description Wrapper to get the default application configured moment locale
   */
  public static defaultLocale(locale?: string): moment.Locale {
    return moment.localeData(locale);
  }

  /**
   * @description Wrapper arround moment longDateFormat global function. Returns the default format used by moment.js
   * in the current application
   *
   * @param locale [[string]]
   */
  public static longDateFormat(locale?: string): string {
    return MomentUtils.defaultLocale(locale).longDateFormat("L");
  }

  /**
   * @description Get application locale, or set and returns the locale being passed as parameter
   * @param lang [[string]]
   */
  public static locale(lang?: string): string {
    return moment.locale();
  }

  static from(date: moment.MomentInput) {
    return moment(date);
  }
}
