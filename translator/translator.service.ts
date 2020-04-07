import { Injectable } from '@angular/core';
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

  /**
   * @description Returns a list of translation that can be use on the Immatriculation component and it children
   * @param params [[string[]]] Translations to be concatenated to the default translations needed to be loaded
   * @param translateParams [[object]] The parameters to eventually passed to the translatorService
   */
  loadTranslations(params: string[] = [], translateParams: object = {}): Promise<any> {
    return this.translate([
      // Default translation for most requests
      'invalidRequestParams',
      'serverRequestFailed',
      'successfulRequest',
      'prompt',
      'validationPrompt',
      'rejectionPrompt',
      'successfulValidation',
      'successfulRejection',
    ].concat(...params), translateParams).toPromise();
  }
}
