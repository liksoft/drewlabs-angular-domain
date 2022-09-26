import { MS_PER_HOURS_, MS_PER_MINUTES_ } from './constants';

type DateUnit = 'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds';
const FORMATS: { [prop: string]: { regex: string; prop: DateUnit } } = {
  DD: {
    regex: '[0-9]{2}',
    prop: 'day',
  },
  MM: {
    regex: '[0-9]{2}',
    prop: 'month',
  },
  YYYY: {
    regex: '[0-9]{4}',
    prop: 'year',
  },
  YY: {
    regex: '[0-9]{2}',
    prop: 'year',
  },
  H: {
    regex: '[0-9]{1,2}',
    prop: 'hours',
  },
  HH: {
    regex: '[0-9]{1,2}',
    prop: 'hours',
  },
  i: {
    regex: '[0-9]{1,2}',
    prop: 'minutes',
  },
  s: {
    regex: '[0-9]{1,2}',
    prop: 'seconds',
  },
};

type DateObjectParam = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const DATE_FORMAT_REGEX = /^DD[/ -]MM[/ -](YYYY|YY)|(DD[/ -](YYYY|YY)[/ -]MM)|(MM[/ -]DD[/ -](YYYY|YY))|(MM[/ -](YYYY|YY)[/ -]DD)|((YYYY|YY)[/ -]MM[/ -]DD)|((YYYY|YY)[/ -]DD[/ -]MM)$/i;
const TIME_FORMAT_REGEX = /H[ :]i[ :]s/i;
const DATE_SEPARATOR_REGEX = /[/ -]/i;
const TIMEZONE_REGEX = /[+-][\d]{2}[:][\d]{2}|Z/i;

export function createFromFormat(date: string, format: string) {
  let timePart: string | undefined;
  let dirtyDatePart: string | undefined;
  let separator = '/';
  const timezoneMatches = date.match(TIMEZONE_REGEX);
  const dateTimezone = timezoneMatches ? timezoneMatches[0] : undefined;
  if (format.includes(':')) {
    const timeCaptures = format.match(TIME_FORMAT_REGEX);
    timePart =
      (timeCaptures || []).length !== 0
        ? (timeCaptures || [])[0]?.trim()
        : undefined;
    dirtyDatePart = format
      .replace(timePart ?? '', '')
      .replace(dateTimezone ?? '', '')
      .trim();
  } else {
    dirtyDatePart = format.trim();
  }
  const datePart = DATE_FORMAT_REGEX.test(dirtyDatePart)
    ? dirtyDatePart
    : undefined;
  if (typeof datePart === 'undefined') {
    throw TypeError('Invalid format passed as argument');
  }
  if (dirtyDatePart) {
    const matches = datePart.match(DATE_SEPARATOR_REGEX);
    separator = (matches || []).length !== 0 ? (matches || [])[0] : separator;
  }
  // Create date slice
  let slice = createTimeUnitSlice(date, datePart, separator);
  if (typeof slice === 'undefined' || slice === null) {
    return new Date(NaN);
  }
  // Create Time slice
  if (timePart) {
    slice = { ...slice, ...createTimeUnitSlice(date, timePart ?? '', ':') };
  }
  // Compute offset
  let offset = 0;
  if (dateTimezone) {
    const sign = dateTimezone.charAt(0) === '+' ? -1 : 1;
    const hours =
      dateTimezone.toLocaleLowerCase() === 'z'
        ? 0
        : +dateTimezone.substring(1, 3);
    const minutes =
      dateTimezone.toLocaleLowerCase() === 'z' ? 0 : +dateTimezone.substring(4);
    offset = sign * (hours * MS_PER_HOURS_ + minutes * MS_PER_MINUTES_);
  }
  // Compute Date object without timezone
  const tmpDateTime_ = new Date(
    slice.year,
    slice.month - 1,
    slice.day,
    slice.hours ?? 0,
    slice.minutes ?? 0,
    slice.seconds ?? 0
  );
  // Create the Jaavscript date time instance adding the timezone offset
  return new Date(tmpDateTime_.getTime() + offset);
}

function createTimeUnitSlice(date: string, format: string, separator: string) {
  const output: DateObjectParam = {} as DateObjectParam;
  const formatComponents = format.split(separator);
  let regexStr = '';
  let index = 0;
  const length = formatComponents.length;
  for (const curr of formatComponents) {
    const object_ = FORMATS[curr];
    if (object_) {
      regexStr += `${object_.regex}${index === length - 1 ? '' : separator}`;
    }
    index++;
  }
  const date_ = date.match(new RegExp(regexStr));
  if (typeof date_ === 'undefined' || date_ === null) {
    return undefined;
  }
  const timeUnitComponents = date_[0].split(separator);
  for (let i = 0; i < formatComponents.length; i++) {
    const object_ = FORMATS[formatComponents[i]];
    if (object_) {
      output[object_.prop] = parseInt(timeUnitComponents[i], 10);
    }
  }
  return output;
}
