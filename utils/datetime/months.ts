import { MONTHS } from './lang/months';
import { Month } from './types';

export class MonthProvider {
  /**
   * @description Returns a month object based on the provided month id
   * @param value Id of a month in the list of predefined month
   */
  public static parseMonth(
    value: number,
    lang: string = 'fr'
  ): string | number {
    const result = MONTHS.filter((month: Month) => +month.id === +value);
    return result.length !== 0 ? result[0][lang] : value;
  }
}
