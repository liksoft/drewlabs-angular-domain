import * as Excel from 'xlsx';
import { ArrayUtils } from './array-utils';

export class ExcelUtils {
  // tslint:disable-next-line: max-line-length
  public static readAsBufferedArray(buffer: ArrayBuffer, defaultDateFormat = 'dd/MM/YYYY', readFirstSheet?: boolean): Promise<object[]|object> {
    return new Promise((resolve, reject) => {
      try {
        const wb = Excel.read(buffer, { type: 'array', cellDates: true, dateNF: defaultDateFormat});
        if (readFirstSheet) {
          resolve(Excel.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval: null}));
          return;
        }
        const data = wb.SheetNames.map((sh: string) => {
          return Excel.utils.sheet_to_json(wb.Sheets[sh], {defval: null});
        });
        resolve(ArrayUtils.flatten(data));
      } catch (err) {
        reject(err);
      }
    });
  }
}
