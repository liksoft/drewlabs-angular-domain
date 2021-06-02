import { Inject, Injectable } from "@angular/core";
import { createStore, onInitStoreStateAction } from "../../../../../rxjs/state/rx-state";
import { controlOptionsReducer } from "../reducers";
import { ControlOptionsState, deserializeControlOption, initialState } from '../actions/control-options';
import { DrewlabsRessourceServerClient } from "../../../../../http/core";
import { map } from "rxjs/operators";
import { isArray, isDefined } from "../../../../../utils";
import { ControlOptionInterface } from "../../compact/types";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ControlOptionsProvider {
    /**
     * Control options store property
     */
    public readonly store$ = createStore(controlOptionsReducer, initialState);
    /**
     * control options state property
     */
    public readonly state$: Observable<ControlOptionsState> = this.store$.connect();

    public resetState = (state: Partial<ControlOptionsState>) => onInitStoreStateAction(this.store$)(state || initialState);

    constructor(
        public readonly client: DrewlabsRessourceServerClient,
        @Inject('CONTROL_OPTION_RESOURCES_PATH') public readonly path: string
    ) { }

    public paginate(params: { [index: string]: any }): Observable<{ data: ControlOptionInterface[], total: number }> {
        return this.client.get(this.path, { params })
            .pipe(
                map(state => {
                    const { data, total } = isDefined(state.data)
                        && (isDefined(state.data.data)) ? state.data : state;
                    if (isDefined(data) && isArray(data)) {
                        return {
                            data: (data as any[]).map(
                                (value) => deserializeControlOption(value)),
                            total
                        };
                    } else {
                        return { data: [], total: 0 };
                    }
                }),
            )
    }

}