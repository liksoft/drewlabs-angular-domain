import { Injectable, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable()
export class TranslationService {
  constructor(public readonly provider: TranslateService) {}

  /**
   * @description Calls the translation service "get" method to load translations
   * @param key [[string|string[]]] index key to load
   * @param params [[object]] parameters value
   */
  public translate(key: string | string[], params?: object): Observable<any> {
    return this.provider.get(key, params);
  }
}
