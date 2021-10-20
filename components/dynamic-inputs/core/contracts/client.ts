import { Observable } from "rxjs";
import { DynamicFormInterface } from "../compact";

export interface FormsClient {
  /**
   * @description Get form definitions using the user provided id
   * @param id
   */
  get(id: string | number): Observable<DynamicFormInterface>;

  /**
   * @description Get form definitions using the list of user provided ids
   * @param id
   */
  getAll(id: string[] | number[]): Observable<DynamicFormInterface[]>;
}
