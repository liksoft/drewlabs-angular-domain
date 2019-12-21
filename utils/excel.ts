import * as Excel from 'xlsx';
import { ArrayUtils } from './array-utils';

export class ExcelUtils {
  public static readAsBufferedArray(buffer: ArrayBuffer): Promise<object[]> {
    return new Promise((resolve, reject) => {
      try {
        const wb = Excel.read(buffer, { type: 'array', cellDates: true });
        const data = wb.SheetNames.map((sh: string) => {
          return Excel.utils.sheet_to_json(wb.Sheets[sh]);
        });
        resolve(ArrayUtils.flatten(data));
      } catch (err) {
        reject(err);
      }
    });
  }
}
