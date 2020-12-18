import { Injectable, OnDestroy } from '@angular/core';
import { FormService } from '../form-control/form.service';
import { TranslationService } from '../../../../translator';
import { DynamicFormHelpers } from './dynamic-form-helpers';
import { ICollection } from '../../../../contracts/collection-interface';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { IDynamicForm } from '../contracts/dynamic-form';
import * as lodash from 'lodash';
import { isDefined } from '../../../../utils';
import { Collection } from '../../../../collections/collection';
import { createSubject } from '../../../../rxjs/helpers';
import { Observable } from 'rxjs';
import { isArray } from 'lodash';


// tslint:disable-next-line: interface-over-type-literal
export type HandlersResultMsg = { success: () => void, error: (error: any) => void, warnings: (errors: any) => void, unknown?: () => void };

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
export class ServerFormHelper implements OnDestroy {

  private inMemoryFormCollection: ICollection<IDynamicForm> = new Collection();
  /**
   * @description Load dynamic form subject instance
   * @var [[BehaviorSubject]]
   */
  public loadForms = createSubject<{ configs: IFormRequestConfig[], result: HandlersResultMsg }>();

  /**
   * @description Form successfully loaded subject instance
   */
  // tslint:disable-next-line: variable-name
  protected _formLoaded = createSubject<ICollection<IDynamicForm>>();
  get formLoaded$(): Observable<ICollection<IDynamicForm>> {
    return this._formLoaded.pipe(startWith(this.inMemoryFormCollection), takeUntil(this.destroy$));
  }
  public readonly destroy$ = createSubject();

  /**
   * @description Instance constructor
   */
  constructor(public readonly form: FormService, private translate: TranslationService) { }

  getFormById = (id: number | string) => {
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

  getForms = async (params: { [prop: string]: any }) => {
    const values = await this.form.getForms(params);
    return values && isArray(values) ? Promise.all(
      values.map(
        value => DynamicFormHelpers.buildDynamicForm(value, this.translate))
    ) : Promise.all([]);
  }

  suscribe = () => {
    // Initialize publishers
    // Register to publishers events
    this.loadForms.asObservable().pipe(
      takeUntil(this.destroy$),
      filter((source) => isDefined(source))
    ).subscribe(async (source) => {
      try {
        const collection: ICollection<IDynamicForm> = new Collection();
        // Get list of form ids that are not in the in-memory forms collection
        const configs = source.configs.filter((item) => {
          return !isDefined(this.inMemoryFormCollection.get(item.id.toString()));
        });
        // Get list of form ids that are in the in-memory forms collection
        const inmemoryConfigs = source.configs.filter((item) => {
          return isDefined(this.inMemoryFormCollection.get(item.id.toString()));
        });
        // Get form configurations that are not in the in-memory forms' collection from the backend provider
        const values = (await this.getForms({
          _query: JSON.stringify({
            whereIn: {
              column: 'id',
              match: configs.map(config => config.id)
            }
          }),
          with_controls: true
        }) as IDynamicForm[]).reduce((acc, current) => {
          const obj = {} as { [prop: string]: any };
          obj[current.id.toString()] = current;
          return { ...acc, ...obj };
        }, {}) as { [prop: string]: IDynamicForm };
        configs.forEach((item) => {
          collection.add(item.label, { ...values[item.id.toString()] });
          // Add loaded form configurations to the in-memory collection
          this.inMemoryFormCollection.add(item.id.toString(), { ...values[item.id.toString()] });
        });
        inmemoryConfigs.forEach((item) => {
          // Get the dynamic form configuration from the in-memory forms' collection
          collection.add(item.label, Object.assign({}, this.inMemoryFormCollection.get(item.id.toString())));
        });
        this._formLoaded.next(lodash.cloneDeep(collection));
        if (isDefined(source.result.success)) {
          source.result.success();
        }
      } catch (error) {
        if (isDefined(source.result.error)) {
          throw source.result.error(error);
        }
      }
    });
  }

  /**
   * @description Unsubscribe from publishers events
   */
  unsubscribe = () => {
    this.destroy$.next({});
    return this;
  }

  /**
   * @description Handles sujects completers
   * @param actions [[Subjeect]]
   */
  onCompleActionListeners = (actions: any[] = null) => {
    this.destroy$.next({});
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
  }
}
