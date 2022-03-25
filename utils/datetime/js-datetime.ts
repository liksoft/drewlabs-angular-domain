export type JsDateParamType = string | number | Date | undefined;

type UnitOfTime =
  | 'year'
  | 'years'
  | 'y'
  | 'month'
  | 'months'
  | 'M'
  | 'week'
  | 'weeks'
  | 'w'
  | 'day'
  | 'days'
  | 'd'
  | 'hour'
  | 'hours'
  | 'h'
  | 'minute'
  | 'minutes'
  | 'm'
  | 'second'
  | 'seconds'
  | 's'
  | 'millisecond'
  | 'milliseconds'
  | 'ms';

type DateTimeFormat =
  | 'L'
  | 'LT'
  | 'LTS'
  | 'l'
  | 'LL'
  | 'll'
  | 'LLL'
  | 'lll'
  | 'M'
  | 'MM'
  | 'MMM'
  | 'MMMM';

export class JSDate {
  private static readonly MS_PER_WEEKS_ = 1000 * 60 * 60 * 24 * 7;
  private static readonly MS_PER_DAYS_ = 1000 * 60 * 60 * 24;
  private static readonly MS_PER_HOURS_ = 1000 * 60 * 60;
  private static readonly MS_PER_MINUTES_ = 1000 * 60;
  private static readonly MS_PER_SECONDS_ = 1000;

  private static LOCALE_: string = 'en-US';

  private static readonly FORMAT_MAP: {
    [prop: string]: Intl.DateTimeFormatOptions;
  } = {
    L: { year: 'numeric', month: '2-digit', day: '2-digit' },
    l: { year: 'numeric', month: 'numeric', day: 'numeric' },
    LL: { year: 'numeric', month: 'long', day: 'numeric' },
    ll: { year: 'numeric', month: 'short', day: 'numeric' },
    LLL: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
    lll: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
    LT: { hour: 'numeric', minute: 'numeric' },
    LTS: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
    M: { month: 'numeric' },
    MM: { month: '2-digit' },
    MMM: { month: 'short' },
    MMMM: { month: 'long' },
    Y: { year: '2-digit' },
    YYYY: { year: 'numeric' },
    D: { day: 'numeric' },
    DD: { day: '2-digit' },
    HH: { hour: '2-digit' },
    H: { hour: 'numeric' },
    II: { minute: '2-digit' },
    I: { minute: 'numeric' },
    SS: { second: '2-digit' },
    S: { second: 'numeric' },
  };

  /**
   * @description Set the global local to use when formating dates
   * @param locale_
   */
  static locale = (locale_: string = 'en-US') => (JSDate.LOCALE_ = locale_);

  /**
   * @description Creates a javascript date object
   * @param value
   */
  static create = <T extends JsDateParamType>(value?: T) => {
    // #region ensureDate()
    const ensureDate = (value_: any) =>
      typeof value_ === 'undefined' || value_ === null
        ? new Date()
        : typeof value_ === 'number'
        ? new Date(value_)
        : (value_ as Date);
    // #endregion ensureDate()
    return typeof value === 'string' ? new Date(value) : ensureDate(value);
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
    value: number = 1
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
    value: number = 1
  ) => {
    const today = JSDate.computeInterval_(JSDate.create(date), unit, value);
    return JSDate.create(today.toISOString());
  };

  /**
   * @description Checks if a given date is after another date
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
   * @description Checks if a given date is before another date
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
   * @description Evaluate if the given parameter is a valid JsDateParamType
   *
   * @param date
   */
  static isDate = (date: Date | string | number) => {
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
   * @description Get the month part of a given date
   *
   * @param date
   */
  static getMonth = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMonth();

  /**
   * @description Get the year part of a given date
   *
   * @param date
   */
  static getYear = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getFullYear();

  /**
   * @description Get the day part of a given date
   *
   * @param date
   */
  static getDay = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getDay();

  /**
   * @description Get hours part of date time object
   *
   * @param date
   */
  static getHours = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getHours();

  /**
   * @description Get minutes part of date time object
   *
   * @param date
   */
  static getMinutes = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMinutes();

  /**
   * @description Get seconds part of date time object
   *
   * @param date
   */
  static getSeconds = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getSeconds();

  /**
   * @description Get ms part of date time object
   *
   * @param date
   */
  static getMilliseconds = <T extends JsDateParamType>(date?: T) =>
    JSDate.create(date).getMilliseconds();

  /**
   * @description Compute time difference between two JavaScript dates
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
        return JSDate.computeTimeDiff(date1_, date2_, JSDate.MS_PER_WEEKS_);
      case 'day':
      case 'days':
      case 'd':
        return JSDate.computeTimeDiff(date1_, date2_, JSDate.MS_PER_DAYS_);
      case 'hour':
      case 'hours':
      case 'h':
        return JSDate.computeTimeDiff(date1_, date2_, JSDate.MS_PER_HOURS_);
      case 'minute':
      case 'minutes':
      case 'm':
        return JSDate.computeTimeDiff(date1_, date2_, JSDate.MS_PER_MINUTES_);
      case 'second':
      case 'seconds':
      case 's':
        return JSDate.computeTimeDiff(date1_, date2_, JSDate.MS_PER_SECONDS_);
      case 'millisecond':
      case 'milliseconds':
      case 'ms':
        return JSDate.computeTimeDiff(date1_, date2_);
      default:
        return JSDate.computeTimeDiff(date1_, date2_);
    }
  };

  /**
   * @description Returns the current date object
   */
  static now = () => JSDate.create();

  /**
   * @description Format Javascript date object
   */
  static format = <T extends JsDateParamType>(
    date?: T,
    format_: DateTimeFormat | string = 'L'
  ) => {
    if (['LT', 'LTS'].includes(format_)) {
      return JSDate.create(date).toLocaleTimeString(
        JSDate.LOCALE_,
        JSDate.FORMAT_MAP[format_]
      );
    }
    if (['l', 'LL', 'll', 'LLL', 'lll', 'L'].includes(format_)) {
      return JSDate.create(date).toLocaleString(
        JSDate.LOCALE_,
        JSDate.FORMAT_MAP[format_]
      );
    }
    return JSDate.rawFormat_(JSDate.create(date), format_);
  };

  static timeSince<T extends JsDateParamType>(date: T) {
    return Math.floor(
      JSDate.computeTimeDiff(JSDate.now(), JSDate.create(date))
    );
  }

  private static rawFormat_ = (date: Date, format_: string) => {
    const matchReplaceFirst = (
      value: string,
      list: string[],
      func: (date: Date, options: Intl.DateTimeFormatOptions) => string
    ) => {
      for (let current of list) {
        if (value.includes(current)) {
          value = value.replace(new RegExp(current, 'gi'), (match) => {
            match = match.toUpperCase();
            const inputFormat_ = JSDate.FORMAT_MAP[match];
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
    incr: boolean = true
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
          ? today.setDate(new Date().getDate() + value * 7)
          : today.setDate(new Date().getDate() - value * 7);
        break;
      case 'day':
      case 'days':
      case 'd':
        incr
          ? today.setDate(new Date().getDate() + value)
          : today.setDate(new Date().getDate() - value);
        break;
      case 'hour':
      case 'hours':
      case 'h':
        incr
          ? today.setHours(new Date().getHours() + value)
          : today.setHours(new Date().getHours() - value);
        break;
      case 'minute':
      case 'minutes':
      case 'm':
        incr
          ? today.setMinutes(new Date().getMinutes() + value)
          : today.setMinutes(new Date().getMinutes() - value);
        break;
      case 'second':
      case 'seconds':
      case 's':
        incr
          ? today.setSeconds(new Date().getSeconds() + value)
          : today.setSeconds(new Date().getSeconds() - value);
        break;
      case 'millisecond':
      case 'milliseconds':
      case 'ms':
        incr
          ? today.setMilliseconds(new Date().getMilliseconds() + value)
          : today.setMilliseconds(new Date().getMilliseconds() - value);
        break;
      default:
        incr
          ? today.setMilliseconds(new Date().getMilliseconds() + value)
          : today.setMilliseconds(new Date().getMilliseconds() - value);
        break;
    }
    return today;
  };

  private static computeTimeDiff = (
    date1: Date,
    date2: Date,
    factor: number = 1
  ) => Math.round((date1.getTime() - date2.getTime()) / factor);

  private static monthDiff = (date1: Date, date2: Date) => {
    let months =
      (date1.getFullYear() - date2.getFullYear()) * 12 - date1.getMonth();
    months += date2.getMonth();
    return months;
  };
}
