import * as Excel from 'xlsx';
import { ArrayUtils } from './array-utils';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { MomentUtils } from './moment-utils';
import { isArray, isDefined } from './type-utils';

export class ExcelUtils {
  // tslint:disable-next-line: max-line-length
  public static readAsBufferedArray(buffer: ArrayBuffer, defaultDateFormat = 'dd/MM/YYYY', readFirstSheet?: boolean): Promise<object[]> {
    return new Promise((resolve, reject) => {
      try {
        const wb = Excel.read(buffer, { type: 'array', cellDates: true, dateNF: defaultDateFormat });
        if (readFirstSheet) {
          resolve(Excel.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null }));
          return;
        }
        const data = wb.SheetNames.map((sh: string) => {
          return Excel.utils.sheet_to_json(wb.Sheets[sh], { defval: null });
        });
        resolve(ArrayUtils.flatten(data));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @description Parse the values of an excel sheet based on the specified headers and date fields
   * @param builder [[ISerializableBuilder]]
   * @param headers [[{ [index: string]: string }]]
   * @param records [[object[]]]
   * @param dateFields [[string]]
   */
  public static parseExcelRecords<T>(
    builder: ISerializableBuilder<T>,
    headers: { [index: string]: string },
    records: object[],
    dateFields: string[] = []
  ) {
    if (records && isArray(records)) {
      return records.map((value: object) => {
        // Checks if the headers of the books meet the requirement
        // Headers Mappings
        const headersPropertyMapping = headers;
        let isValidBook = true;
        const mappingValidObject: any = {};
        for (const [k, v] of Object.entries(headersPropertyMapping)) {
          if (Object.keys(value).indexOf(v) === -1) {
            isValidBook = false;
            break;
          }
          if ((dateFields.length > 0) && (dateFields.indexOf(k) !== -1)) {
            mappingValidObject[k] = MomentUtils.parseDate(value[v]);
            continue;
          }
          mappingValidObject[k] = value[v];
        }
        if (isValidBook) {
          return builder
            .fromSerialized(mappingValidObject);
        }
      }).filter((i) => isDefined(i));
    }
    return [];
  }
}
