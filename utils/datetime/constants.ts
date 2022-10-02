// @internal
export const MS_PER_WEEKS_ = 1000 * 60 * 60 * 24 * 7;
// @internal
export const MS_PER_DAYS_ = 1000 * 60 * 60 * 24;
// @internal
export const MS_PER_HOURS_ = 1000 * 60 * 60;
// @internal
export const MS_PER_MINUTES_ = 1000 * 60;
// @internal
export const MS_PER_SECONDS_ = 1000;

// February is null to handle the leap year (using ||)
export const DAYS_PER_MONTHS_ = [
  31,
  null,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

// @internal
export const INTL_DATE_TIME_FORMATS: {
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

export const PATTERNS = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/,
};

export const DATE_REGEX = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
export const TIME_REGEX = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
export const TIMEZONE_REGEX = /^([+-])(\d{2})(?::?(\d{2}))?$/;
