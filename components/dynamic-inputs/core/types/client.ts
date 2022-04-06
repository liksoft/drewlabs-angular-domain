import { Observable } from "rxjs";
import { IDynamicForm } from "./form";

export interface FormsClient {
  /**
   * @description Get form definitions using the user provided id
   * @param id
   */
  get(id: string | number): Observable<IDynamicForm>;

  /**
   * @description Get form definitions using the list of user provided ids
   * @param id
   */
  getAll(id: string[] | number[]): Observable<IDynamicForm[]>;
}
