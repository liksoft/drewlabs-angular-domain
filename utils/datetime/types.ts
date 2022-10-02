// @internal
export type UnitOfTime =
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

// @internal
export type DateTimeFormat =
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

/**
 * Interface representing Roman Calendar month by index
 * with internationalization locales
 */
export interface Month {
  id: number;
  fr: string;
  en: string;
}

/**
 * Type definition of value that can be passed as parameter for
 * {@see JSDate.create()} a.k.a values parseable as Javascript
 * date object
 */
export type JsDateParamType = string | number | Date | undefined;

export interface AdditionalDigits {
  additionalDigits?: 0 | 1 | 2;
}

export interface DateString {
  date?: string;
  time?: string;
  timezone?: string;
}

export interface ParsedYear {
  year: number;
  restDateString: string;
}
