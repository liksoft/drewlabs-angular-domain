import { createStore } from "../../../../rxjs/state/rx-state";
import { FormState } from "../../core/v2/actions";
import { formsReducer } from "../../core/v2/reducers";
import { Observable } from "rxjs";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { DYNAMIC_FORM_LOADER, FormsLoaderInterface } from ".";
import { onNewFormAction } from "../../core/v2/actions/form";
import { tap } from "rxjs/operators";
import { DynamicFormInterface } from "../../core/compact";
import { doLog } from "src/app/lib/core/rxjs/operators";

export const initialState: FormState = {
  collections: {
    currentPage: 1,
    total: 0,
    items: {},
    data: [],
  },
  performingAction: false,
};

export abstract class AbstractDynamicFormService {
  public readonly store$ = createStore(formsReducer, initialState);

  get state$(): Observable<FormState> {
    return this.store$.connect();
  }

  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  abstract loadConfiguredForms(
    endpoint: string,
    options?: { [index: string]: any }
  ): Observable<never> | Observable<DynamicFormInterface[]>;
}

@Injectable()
export class DynamicFormService
  extends AbstractDynamicFormService
  implements OnDestroy
{
  constructor(
    @Inject(DYNAMIC_FORM_LOADER) private loader: FormsLoaderInterface
  ) {
    super();
  }

  /**
   * Provides predefined dynamic forms loader implementation
   *
   * @param endpoint
   * @param options
   */
  loadConfiguredForms = (
    endpoint: string,
    options: { [index: string]: any } = {}
  ) => {
    return this.loader.load(endpoint, options).pipe(
      tap((state) => onNewFormAction(this.store$)(state)),
      doLog("DynamicFormService service: ")
    );
  };

  ngOnDestroy(): void {
    this.store$.destroy();
  }
}
