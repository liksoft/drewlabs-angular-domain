import { Injectable } from '@angular/core';
import { MomentUtils } from '../utils/moment-utils';

@Injectable()
export class DateTimeHelper {

  /**
   * @description Return the current date
   * @param format [[string]]
   */
  public now(format: string = null) {
    return MomentUtils.now(format);
  }
}
