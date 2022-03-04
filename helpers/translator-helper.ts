
import { TranslationService } from '../translator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorHelperService {
  constructor(
    private translate: TranslationService,
  ) { }
  /**
   * @description Returns a list of translation that can be use on the Immatriculation component and it children
   * @param params [[string[]]] Translations to be concatenated to the default translations needed to be loaded
   * @param translateParams [[object]] The parameters to eventually passed to the translatorService
   */
  loadTranslations(params: string[] = [], translateParams: object = {}): Promise<any> {
    return this.translate.translate([
      // Default translation for most requests
      'invalidRequestParams',
      'serverRequestFailed',
      'successfulRequest',
      'prompt',
      'validationPrompt',
      'rejectionPrompt',
      'deletionPrompt',
      'successfulValidation',
      'successfulRejection',
    ].concat(...params), translateParams).toPromise();
  }
}
