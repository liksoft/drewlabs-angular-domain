import {
  INTL_DATE_TIME_FORMATS,
  MS_PER_DAYS_,
  MS_PER_HOURS_,
  MS_PER_MINUTES_,
  MS_PER_SECONDS_,
  MS_PER_WEEKS_,
} from './constants';
import { createFromFormat } from './date-from-format';
import { parseISO } from './parse-iso';
import {
  AdditionalDigits,
  DateTimeFormat,
  JsDateParamType,
  UnitOfTime,
} from './types';

/**
 * JSDate is an utility class for manipulating javascript date object. It offers various
 * methods to serve this purpose.
 *
 * Note: The package being under active development, required method will be added and Api
 * can be changed.
 */
export class JSDate {
  private static LOCALE_ = 'en-US';

  /**
   * Set the global local to use when formating dates
   *
   * @param locale_
   */
  static locale = (locale_?: string) => {
    if (locale_) {
      JSDate.LOCALE_ = locale_;
    }
    return JSDate.LOCALE_;
  };

  /**
   * Creates a javascript date object
   *
   * @param value
   * @param format Specify input format to parse the date from
   *
   * ** Note **
   * Parsing from format is not yet implemented
   */
  static create = <T extends JsDateParamType>(value?: T, format?: string) => {
    // #region ensureDate()
    const makeDate = (value_: any) =>
      typeof value_ === 'undefined' || value_ === null
        ? new Date()
        : typeof value_ === 'number'
        ? new Date(value_)
        : value_ instanceof Date
        ? new Date(value_.getTime())
        : (value_ as Date);
    // #endregion ensureDate()
    return typeof value === 'string'
      ? JSDate.createFromFormat_(value, format)
      : makeDate(value);
  };

  /**
   * Substract time unit from a js date
   *
   * @param unit
   * @param date
   * @param value
   * @returns
   */
  static substract = <T extends JsDateParamType>(
    unit: UnitOfTime,
    date?: T,
    value = 1
  ) => {
    const today = JSDate.computeInterval_(
      JSDate.create(date),
      unit,
      value,
      false
    );
    return JSDate.create(today.toISOString());
  };

  /**
   * Adds time unit from a js date
   *
   * @param unit
   * @param date
   * @param value
   * @returns
   */
  static add = <T extends JsDateParamType>(
    unit: UnitOfTime,
    date?: T,
    value = 1
  ) => {
    const today = JSDate.computeInterval_(JSDate.create(date), unit, value);
    return JSDate.create(today.toISOString());
  };

  /**
   * Checks if a given date is before the current date
   *
   * @param date
   */
  static isPast = <T extends JsDateParamType>(date: T) =>
    JSDate.isBefore(date, JSDate.now() as JsDateParamType);

  /**
   * Checks if a given date is after the current date
   *
   * @param date
   */
  static isFuture = <T extends JsDateParamType>(date: T) =>
    JSDate.isAfter(date, JSDate.now() as JsDateParamType);

  /**
   * Checks if a given date is after another date
   *
   * @param date1
   * @param date2
   */
  static isAfter = <T extends JsDateParamType>(date1: T, date2: T) => {
    const date1_ = JSDate.create(date1);
    const date2_ = JSDate.create(date2);
    return date1_.getTime() - date2_.getTime() > 0;
  };

  /**
   * Checks if a given date is before another date
   *
   * @param date1
   * @param date2
   */
  static isBefore = <T extends JsDateParamType>(date1: T, date2: T) => {
    const date1_ = JSDate.create(date1);
    const date2_ = JSDate.create(date2);
    return date1_.getTime() - date2_.getTime() < 0;
  };

  /**
   * Evaluate if the given parameter is a valid JsDateParamType
   *
   * @param date
   */
  static isDate = (date: Date) => {
    return (
      date instanceof Date ||
      (typeof date === 'object' &&
        Object.prototype.toString.call(date) === '[object Date]')
    );
  };

  static isValid = (date: any) => {
    try {
      const value = JSDate.create(date);
      return (
        typeof value !== 'undefined' &&
        value !== null &&
        value?.toDateString() !== 'Invalid Date'
      );
    } catch (e) {
      return false;
    }
  };

  /**
   * Get the month part of a given date
   *
   * @param date
   */
  static getMonth = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMonth();

  /**
   * Get the year part of a given date
   *
   * @param date
   */
  static getYear = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getFullYear();

  /**
   * Get the day of the week part of a given date
   *
   * @param date
   */
  static getDay = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getDay();

  /**
   * Get the day of the month part of a given date
   *
   * @param date
   */
  static getDate = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getDate();

  /**
   * Get hours part of date time object
   *
   * @param date
   */
  static getHours = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getHours();

  /**
   * Get minutes part of date time object
   *
   * @param date
   */
  static getMinutes = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMinutes();

  /**
   * Get seconds part of date time object
   *
   * @param date
   */
  static getSeconds = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getSeconds();

  /**
   * Get ms part of date time object
   *
   * @param date
   */
  static getMilliseconds = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMilliseconds();

  /**
   * Compute time difference between two JavaScript dates
   *
   * @param date1
   * @param date2
   * @param unit
   */
  static diff = <T extends JsDateParamType>(
    date1: T,
    date2: T,
    unit: UnitOfTime = 'ms'
  ) => {
    const date1_ = JSDate.create(date1);
    const date2_ = JSDate.create(date2);
    switch (unit) {
      case 'year':
      case 'years':
      case 'y':
        return date1_.getFullYear() - date2_.getFullYear();
      case 'month':
      case 'months':
      case 'M':
        return JSDate.monthDiff(date1_, date2_);
      case 'week':
      case 'weeks':
      case 'w':
        return JSDate.computeTimeDiff(date1_, date2_, MS_PER_WEEKS_);
      case 'day':
      case 'days':
      case 'd':
        return JSDate.computeTimeDiff(date1_, date2_, MS_PER_DAYS_);
      case 'hour':
      case 'hours':
      case 'h':
        return JSDate.computeTimeDiff(date1_, date2_, MS_PER_HOURS_);
      case 'minute':
      case 'minutes':
      case 'm':
        return JSDate.computeTimeDiff(date1_, date2_, MS_PER_MINUTES_);
      case 'second':
      case 'seconds':
      case 's':
        return JSDate.computeTimeDiff(date1_, date2_, MS_PER_SECONDS_);
      case 'millisecond':
      case 'milliseconds':
      case 'ms':
        return JSDate.computeTimeDiff(date1_, date2_);
      default:
        return JSDate.computeTimeDiff(date1_, date2_);
    }
  };

  /**
   * Returns the current date object
   */
  static now = () => JSDate.create();

  /**
   * Format Javascript date object
   */
  static format = <T extends JsDateParamType>(
    date?: T,
    format_: DateTimeFormat | string = 'L'
  ) => {
    if (['LT', 'LTS'].indexOf(format_) !== -1) {
      return JSDate.create(date).toLocaleTimeString(
        JSDate.LOCALE_,
        INTL_DATE_TIME_FORMATS[format_]
      );
    }
    if (['l', 'LL', 'll', 'LLL', 'lll', 'L'].indexOf(format_) !== -1) {
      return JSDate.create(date).toLocaleString(
        JSDate.LOCALE_,
        INTL_DATE_TIME_FORMATS[format_]
      );
    }
    return JSDate.rawFormat_(JSDate.create(date), format_);
  };

  /**
   * Computes the number of milliseconds differences between a given
   * date and today.
   *
   * @param date
   */
  static timeSince<T extends JsDateParamType>(date: T) {
    return Math.floor(
      JSDate.computeTimeDiff(JSDate.now(), JSDate.create(date))
    );
  }

  static toDate(argument: Date | number) {
    const toStringFunction = Object.prototype.toString.call(argument);
    if (
      argument instanceof Date ||
      (typeof argument === 'object' && toStringFunction === '[object Date]')
    ) {
      return new Date(argument.getTime());
    } else if (
      typeof argument === 'number' ||
      toStringFunction === '[object Number]'
    ) {
      return new Date(argument);
    }
    return new Date(NaN);
  }

  static getUTCDayOfYear(date: Date | number) {
    const date_ = JSDate.toDate(date);
    if (typeof date_ === 'undefined' || date_ === null) {
      return false;
    }
    const timestamp = date_.getTime();
    date_.setUTCMonth(0, 1);
    date_.setUTCHours(0, 0, 0, 0);
    const startOfYearTimestamp = date_.getTime();
    const difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MS_PER_DAYS_) + 1;
  }

  static iso8601(date: string, options?: AdditionalDigits) {
    return parseISO(date, options);
  }

  private static rawFormat_ = (date: Date, format_: string) => {
    const matchReplaceFirst = (
      value: string,
      list: string[],
      func: (date: Date, options: Intl.DateTimeFormatOptions) => string
    ) => {
      for (const current of list) {
        if (value.includes(current)) {
          value = value.replace(new RegExp(current, 'gi'), match => {
            match = match.toUpperCase();
            const inputFormat_ = INTL_DATE_TIME_FORMATS[match];
            return `${func(date, inputFormat_)}`;
          });
          break;
        }
      }
      return value;
    };
    return [
      {
        format: ['YYYY', 'Y'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleDateString(JSDate.LOCALE_, options),
      },
      {
        format: ['MMMM', 'MMM', 'MM', 'M'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleDateString(JSDate.LOCALE_, options),
      },
      {
        format: ['DD', 'D'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleDateString(JSDate.LOCALE_, options),
      },
      {
        format: ['HH', 'H'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleTimeString(JSDate.LOCALE_, options),
      },
      {
        format: ['II', 'I'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleTimeString(JSDate.LOCALE_, options),
      },
      {
        format: ['SS', 'S'],
        fn: (date: Date, options: Intl.DateTimeFormatOptions) =>
          date.toLocaleTimeString(JSDate.LOCALE_, options),
      },
    ]
      .reduce((carry, current) => {
        carry = matchReplaceFirst(carry, current.format, current.fn);
        return carry;
      }, format_.toUpperCase())
      .replace(' h', '')
      .replace(' PM', 'PM')
      .replace(' AM', 'AM');
  };

  private static computeInterval_ = (
    today: Date,
    unit: UnitOfTime,
    value: number,
    incr = true
  ) => {
    switch (unit) {
      case 'year':
      case 'years':
      case 'y':
        incr
          ? today.setFullYear(today.getFullYear() + value)
          : today.setFullYear(today.getFullYear() - value);
        break;
      case 'month':
      case 'months':
      case 'M':
        incr
          ? today.setMonth(today.getMonth() + value)
          : today.setMonth(today.getMonth() - value);
        break;
      case 'week':
      case 'weeks':
      case 'w':
        incr
          ? today.setDate(today.getDate() + value * 7)
          : today.setDate(today.getDate() - value * 7);
        break;
      case 'day':
      case 'days':
      case 'd':
        incr
          ? today.setDate(today.getDate() + value)
          : today.setDate(today.getDate() - value);
        break;
      case 'hour':
      case 'hours':
      case 'h':
        incr
          ? today.setHours(today.getHours() + value)
          : today.setHours(today.getHours() - value);
        break;
      case 'minute':
      case 'minutes':
      case 'm':
        incr
          ? today.setMinutes(today.getMinutes() + value)
          : today.setMinutes(today.getMinutes() - value);
        break;
      case 'second':
      case 'seconds':
      case 's':
        incr
          ? today.setSeconds(today.getSeconds() + value)
          : today.setSeconds(today.getSeconds() - value);
        break;
      case 'millisecond':
      case 'milliseconds':
      case 'ms':
        incr
          ? today.setMilliseconds(today.getMilliseconds() + value)
          : today.setMilliseconds(today.getMilliseconds() - value);
        break;
      default:
        incr
          ? today.setMilliseconds(today.getMilliseconds() + value)
          : today.setMilliseconds(today.getMilliseconds() - value);
        break;
    }
    return today;
  };

  private static computeTimeDiff = (
    date1: Date,
    date2: Date,
    factor = 1
  ) => Math.round((date1.getTime() - date2.getTime()) / factor);

  private static monthDiff = (date1: Date, date2: Date) => {
    let months =
      (date1.getFullYear() - date2.getFullYear()) * 12 - date1.getMonth();
    months += date2.getMonth();
    return months;
  };

  private static createFromFormat_ = (date: string, format?: string) => {
    if (typeof format !== 'string') {
      return parseISO(date);
    }
    return createFromFormat(date, format);
  };
}
