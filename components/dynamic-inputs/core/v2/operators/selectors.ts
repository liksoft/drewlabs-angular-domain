import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormState } from "../actions";

export const select_form =
  (id: string | number) => (source$: Observable<FormState>) => {
    return source$.pipe(
      map((state) => state?.collections?.items[id] || undefined)
    );
  };

export const selectall =
  (list: string[]) => (source$: Observable<FormState>) => {
    return source$.pipe(
      map(
        (state) =>
          Object.values(state?.collections?.items).filter((state) =>
            list.includes(String(state.id))
          ) || []
      )
    );
  };
