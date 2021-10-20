import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter, take } from "rxjs/operators";
import { ActionHandler } from "src/app/lib/core/rxjs/handlers";
import { FormsClient } from "../../core";
import { DynamicFormInterface } from "../../core/compact";
import { FormState, FormStoreActions } from "../../core/v2";
import { selectall, select_form } from "../../core/v2/operators";
import { FORMS_PROVIDER } from "../types";

@Injectable()
export class JSONFormsClient implements FormsClient {
  // Creates an instance of the FormClient class
  constructor(
    @Inject(FORMS_PROVIDER)
    private provider: ActionHandler<FormState, FormStoreActions>
  ) {}

  /**
   * @inheritdoc
   */
  get(id: string | number): Observable<DynamicFormInterface> {
    return this.provider.state$.pipe(
      select_form(id),
      filter((state) => (state ? true : false)),
      take(1)
    );
  }
  getAll(list: string[] | number[]): Observable<DynamicFormInterface[]> {
    return this.provider.state$.pipe(
      selectall(list.map((value: string | number) => String(value))),
      filter((state) => (state ? true : false)),
      take(1)
    );
  }
}
