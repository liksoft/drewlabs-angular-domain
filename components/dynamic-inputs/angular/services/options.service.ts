import { Inject, Injectable, OnDestroy } from "@angular/core";
import {
  createStore,
  onInitStoreStateAction,
} from "../../../../rxjs/state/rx-state";
import { DrewlabsRessourceServerClient } from "../../../../http/core";
import { map } from "rxjs/operators";
import { isArray, isDefined } from "../../../../utils";
import { Observable } from "rxjs";
import { controlOptionsReducer } from "../../core/v2/reducers";
import {
  OptionsState,
  deserializeOption,
  OptionsInitialState,
} from "../../core/v2/actions";
import { OptionInterface } from "../../core/compact/types";

@Injectable({
  providedIn: "root",
})
export class OptionsService implements OnDestroy {
  public readonly store$ = createStore(
    controlOptionsReducer,
    OptionsInitialState
  );

  public readonly state$: Observable<OptionsState> = this.store$.connect();

  constructor(
    public readonly client: DrewlabsRessourceServerClient,
    @Inject("CONTROL_OPTION_RESOURCES_PATH") public readonly path: string
  ) {}

  public paginate(params: {
    [index: string]: any;
  }): Observable<{ data: OptionInterface[]; total: number }> {
    return this.client.get(this.path, { params }).pipe(
      map((state) => {
        const { data, total } =
          isDefined(state.data) && isDefined(state.data.data)
            ? state.data
            : state;
        if (isDefined(data) && isArray(data)) {
          return {
            data: (data as any[]).map((value) => deserializeOption(value)),
            total,
          };
        } else {
          return { data: [], total: 0 };
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.store$.destroy();
  }

  public resetState = (state: Partial<OptionsState>) =>
    onInitStoreStateAction(this.store$)(state || OptionsInitialState);
}
