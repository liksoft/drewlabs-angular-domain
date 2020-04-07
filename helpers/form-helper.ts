import { Injectable, OnDestroy } from '@angular/core';
// import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormService } from '../components/dynamic-inputs/core/form-control/form.service';
import { isDefined } from '../utils/type-utils';
import { TranslationService } from '../translator';
import { DynamicFormHelpers } from './component-reactive-form-helpers';
import { IDynamicForm } from '../components/dynamic-inputs/core';
import { Subject, Subscription } from 'rxjs';
import { ICollection } from '../contracts/collection-interface';
import { filter } from 'rxjs/operators';
import { Collection } from '../utils/collection';
import { HandlersResultMsg } from '../entity/abstract-entity';

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
   * @description Load dynamic form subject instance
   * @var [[BehaviorSubject]]
   */
  public readonly loadForms = new Subject<{ configs: IFormRequestConfig[], result: HandlersResultMsg }>();

  /**
   * @description Form successfully loaded subject instance
   */
  // tslint:disable-next-line: variable-name
  protected _formLoaded = new Subject<ICollection<IDynamicForm>>();
  get formLoaded$() {
    return this._formLoaded.asObservable();
  }

  private subscriptions: Subscription[] = [];
  // tslint:disable-next-line: variable-name
  private _publishers: Subject<any>[];

  /**
   * @description Instance constructor
   */
  constructor(public readonly form: FormService, private translate: TranslationService) {
    this._publishers = [
      this.loadForms, this._formLoaded
    ];
  }

  public getFormById(id: number | string) {
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

  suscribe() {
    this.subscriptions.push(
      // Dynamic form loader publisher
      this.loadForms.asObservable().pipe(
        filter((source) => isDefined(source))
      ).subscribe(async (source) => {
        try {
          const values = await Promise.all(source.configs.map((i) => this.getFormById(i.id)));
          const collection: ICollection<IDynamicForm> = new Collection();
          source.configs.forEach((item) => { collection.add(item.label, values[source.configs.indexOf(item)]); });
          this._formLoaded.next(collection);
          if (isDefined(source.result.success)) {
            source.result.success();
          }
        } catch (error) {
          if (isDefined(source.result.error)) {
            throw source.result.error(error);
          }
        }
      }),
    );
  }

  /**
   * @description Unsubscribe from publishers events
   */
  unsubscribe() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    return this;
  }

  /**
   * @description Handles sujects completers
   * @param actions [[Subjeect]]
   */
  onCompleActionListeners(actions: Subject<any>[]) {
    actions.forEach((a) => a.observers.forEach((ob) => ob.complete()));
  }

  public ngOnDestroy() {
    this._publishers.forEach((s) => s.complete());
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
