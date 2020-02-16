import { Injectable, OnDestroy } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
import { FormService } from '../components/dynamic-inputs/core/form-control/form.service';
import { isDefined } from '../utils/type-utils';
import { TranslationService } from '../translator';
import { DynamicFormHelpers } from './component-reactive-form-helpers';
import { IDynamicForm } from '../components/dynamic-inputs/core';

/**
 * @description Definition of form request configuration object
 */
export interface IFormRequestConfig {
  id: number;
  label?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormHelperService implements OnDestroy {

  /**
   * @description Instance constructor
   */
  constructor(public readonly form: FormService, private translate: TranslationService) {
  }

  public getFormById(id: number|string) {
    return new Promise<IDynamicForm>((resolve, _) => {
      this.form.getForm(id).then(async (f) => {
        if (isDefined(f)) {
          resolve(await DynamicFormHelpers.buildDynamicForm(f, this.translate));
        }
        resolve(null);
      })
        .catch((err) => { _(err); });
    });
  }

  ngOnDestroy() {}
}
