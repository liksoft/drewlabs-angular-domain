import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateTimeHelper {

  /**
   * @description Return the current date
   * @param _ [[string]]
   */
  public now(_: string = null) {
    return new Date();
  }
}
