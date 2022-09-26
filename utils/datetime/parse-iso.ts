import {
  DATE_REGEX,
  DAYS_PER_MONTHS_,
  MS_PER_HOURS_,
  MS_PER_MINUTES_,
  PATTERNS,
  TIMEZONE_REGEX,
  TIME_REGEX,
} from './constants';
import { AdditionalDigits, DateString, ParsedYear } from './types';

export function asInt(number: unknown): number {
  if (
    typeof number === 'undefined' ||
    number === null ||
    number === true ||
    number === false
  ) {
    return NaN;
  }
  const number_ = Number(number);
  if (isNaN(number_)) {
    return number_;
  }
  return number_ < 0 ? Math.ceil(number_) : Math.floor(number_);
}

const substr = (str: string, offset: number, length: number) =>
  str.substring(offset, Math.min(str.length, offset + length));

/**
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date
 *
 * @param argument
 * @param options
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * const result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * const result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */
export function parseISO(argument: string, options?: AdditionalDigits) {
  options = options || {};

  const additionalDigits =
    options.additionalDigits == null ? 2 : asInt(options.additionalDigits);
  if (
    additionalDigits !== 2 &&
    additionalDigits !== 1 &&
    additionalDigits !== 0
  ) {
    throw new RangeError('additionalDigits must be 0, 1 or 2');
  }

  if (
    !(
      typeof argument === 'string' ||
      Object.prototype.toString.call(argument) === '[object String]'
    )
  ) {
    return new Date(NaN);
  }

  const dateStrings = splitDateString(argument);
  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }

  if (!date || isNaN(date.getTime())) {
    return new Date(NaN);
  }

  const timestamp = date.getTime();
  let time = 0;
  let offset;

  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return new Date(NaN);
    }
  }

  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    const dirtyDate = new Date(timestamp + time);
    // js parsed string assuming it's in UTC timezone
    // but we need it to be parsed in our timezone
    // so we use utc values to build date in our timezone.
    // Year values from 0 to 99 map to the years 1900 to 1999
    // so set year explicitly with setFullYear.
    const result = new Date(0);
    result.setFullYear(
      dirtyDate.getUTCFullYear(),
      dirtyDate.getUTCMonth(),
      dirtyDate.getUTCDate()
    );
    result.setHours(
      dirtyDate.getUTCHours(),
      dirtyDate.getUTCMinutes(),
      dirtyDate.getUTCSeconds(),
      dirtyDate.getUTCMilliseconds()
    );
    return result;
  }

  return new Date(timestamp + time + offset);
}

function splitDateString(dateString: string): DateString {
  const dateStrings: DateString = {};
  const array = dateString.split(PATTERNS.dateTimeDelimiter);
  let timeString;
  // The regex match should only return at maximum two array elements.
  // [date], [time], or [date, time].
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (PATTERNS.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(PATTERNS.timeZoneDelimiter)[0];
      timeString = substr(
        dateString,
        dateStrings.date.length,
        dateString.length
      );
    }
  }

  if (timeString) {
    const token = PATTERNS.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString: string, additionalDigits: number): ParsedYear {
  const regex = new RegExp(
    '^(?:(\\d{4}|[+-]\\d{' +
      (4 + additionalDigits) +
      '})|(\\d{2}|[+-]\\d{' +
      (2 + additionalDigits) +
      '})$)'
  );

  const captures = dateString.match(regex);
  // Invalid ISO-formatted year
  if (!captures) return { year: NaN, restDateString: '' };

  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;

  // either year or century is null, not both
  return {
    year: century === null ? (year as number) : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length),
  };
}

function parseDate(dateString: string, year: number): Date {
  // Invalid ISO-formatted year
  if (year === null) return new Date(NaN);

  const captures = dateString.match(DATE_REGEX);
  // Invalid ISO-formatted string
  if (!captures) return new Date(NaN);

  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;

  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = new Date(0);
    if (
      !validateDate(year, month, day) ||
      !validateDayOfYearDate(year, dayOfYear)
    ) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}

function parseDateUnit(value: string): number {
  return value ? parseInt(value) : 1;
}

function parseTime(timeString: string): number {
  const captures = timeString.match(TIME_REGEX);
  if (!captures) return NaN; // Invalid ISO-formatted time

  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);

  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }

  return hours * MS_PER_HOURS_ + minutes * MS_PER_MINUTES_ + seconds * 1000;
}

function parseTimeUnit(value: string): number {
  return (value && parseFloat(value.replace(',', '.'))) || 0;
}

function parseTimezone(timezoneString: string): number {
  if (timezoneString === 'Z') return 0;

  const captures = timezoneString.match(TIMEZONE_REGEX);
  if (!captures) return 0;

  const sign = captures[1] === '+' ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = (captures[3] && parseInt(captures[3])) || 0;

  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }

  return sign * (hours * MS_PER_HOURS_ + minutes * MS_PER_MINUTES_);
}

function dayOfISOWeekYear(
  isoWeekYear: number,
  week: number,
  day: number
): Date {
  const date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// Validation functions

function isLeapYearIndex(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function validateDate(year: number, month: number, date: number): boolean {
  return (
    month >= 0 &&
    month <= 11 &&
    date >= 1 &&
    date <= (DAYS_PER_MONTHS_[month] || (isLeapYearIndex(year) ? 29 : 28))
  );
}

function validateDayOfYearDate(year: number, dayOfYear: number): boolean {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}

function validateWeekDate(_year: number, week: number, day: number): boolean {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}

function validateTime(
  hours: number,
  minutes: number,
  seconds: number
): boolean {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }

  return (
    seconds >= 0 &&
    seconds < 60 &&
    minutes >= 0 &&
    minutes < 60 &&
    hours >= 0 &&
    hours < 25
  );
}

function validateTimezone(_hours: number, minutes: number): boolean {
  return minutes >= 0 && minutes <= 59;
}
