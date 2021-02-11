import { isDefined } from "./types/type-utils";

export class AmountFormatter {

  /**
   * @description Format an amount into a specified format
   * @param balance Amount to format
   * @param decimal Decimal part
   * @param separator Values seperator
   */
  public static formatBalance(balance: any, decimal: number, separator: string) {
    let inDecimal: any = Math.round(
      Math.pow(10, decimal) *
      (Math.abs(balance) - Math.floor(Math.abs(balance)))
    );
    let inBalance = Math.floor(Math.abs(balance));

    if (decimal === 0 || inDecimal === Math.pow(10, decimal)) {
      inBalance = Math.floor(Math.abs(balance));
      inDecimal = 0;
    }
    let balanceFormat = inBalance + '';
    const nb = balanceFormat.length;
    for (let i = 1; i < 4; i++) {
      if (inBalance >= Math.pow(10, 3 * i)) {
        balanceFormat =
          balanceFormat.substring(0, nb - 3 * i) +
          separator +
          balanceFormat.substring(nb - 3 * i);
      }
    }
    if (decimal > 0) {
      let decim = '';
      for (let j = 0; j < decimal - inDecimal.toString().length; j++) {
        decim += '0';
      }
      inDecimal = decim + inDecimal.toString();
      balanceFormat = balanceFormat + '.' + inDecimal;
    }
    if (parseFloat(balance) < 0) {
      balanceFormat = '-' + balanceFormat;
    }
    return balanceFormat;
  }
}

export const numberToAmountFormat = (value: any, decimal: any | number = 0, separator: string = ' ') => {
  if (!isDefined(value)) {
    return '0.00';
  }
  return AmountFormatter.formatBalance(value, decimal, separator);
};
