import { JSDate } from './js-datetime';

type ShortTimeUnit_ = 'y' | 'm' | 'w' | 'd' | 'h' | 'i' | 's';

type Locale_ = 'en-US' | 'fr-FR' | string;

type TimeSinceLocaleConfig = {
  [index in Locale_]: {
    timeUnit: {
      [ShortTimeUnit_: string]: any;
    };
    ago: string;
    later: string;
  };
};

const DEFAULT_LOCALES: TimeSinceLocaleConfig = {
  'en-US': {
    timeUnit: {
      d: 'days',
      m: 'months',
      y: 'years',
      i: 'minutes',
      s: 'seconds',
      h: 'hours',
    },
    ago: 'ago',
    later: 'later',
  },
  'fr-FR': {
    timeUnit: {
      d: 'jours',
      m: 'mois',
      y: 'années',
      i: 'minutes',
      s: 'seconds',
      h: 'heures',
    },
    ago: 'de cela',
    later: 'après',
  },
};

const formatTimeSince = (ms: number) => {
  let seconds = ms / 1000;
  const isBeforeNow = seconds > 0;
  seconds = Math.abs(seconds);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return timeSinceOutput(Math.floor(interval), 'y', isBeforeNow);
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return timeSinceOutput(Math.floor(interval), 'm', isBeforeNow);
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return timeSinceOutput(Math.floor(interval), 'd', isBeforeNow);
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return timeSinceOutput(Math.floor(interval), 'h', isBeforeNow);
  }
  interval = seconds / 60;
  if (interval > 1) {
    return timeSinceOutput(Math.floor(interval), 'i', isBeforeNow);
  }
  return timeSinceOutput(Math.floor(interval), 's', isBeforeNow);
};

const timeSinceOutput = (
  result: number,
  unit: ShortTimeUnit_,
  isBeforeNow: boolean
) => {
  return (locales: TimeSinceLocaleConfig, locale: Locale_) => {
    return isBeforeNow
      ? `${result} ${locales[locale]['timeUnit'][unit]} ${locales[locale]['ago']}`
      : `${result} ${locales[locale]['timeUnit'][unit]} ${locales[locale]['later']}`;
  };
};

export class TimeAgo {
  // Instance initializer
  constructor(private locales: TimeSinceLocaleConfig = DEFAULT_LOCALES) {}

  format(date: string | Date, locale?: Locale_) {
    return formatTimeSince(JSDate.timeSince(JSDate.create(date)))(
      this.locales ?? DEFAULT_LOCALES,
      locale ?? 'en-US'
    );
  }
}
