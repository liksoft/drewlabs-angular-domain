import { IEntityServiceProvider } from '../contracts/entity-service-provider';
import { ISerializableBuilder } from '../built-value/contracts/serializers';
import { GetAllReq } from './contracts/requests';
import { tap, catchError, scan, map, mergeMap, filter } from 'rxjs/operators';
import { throwError, Subject, merge } from 'rxjs';

export class DeclarativeEntityProvider<T> {

  private allEntitySubject = new Subject<GetAllReq>();
  private allEntityAction$ = this.allEntitySubject.asObservable();

  // Provide list of entity of type T
  allEntity$ = this.allEntityAction$.pipe(
    filter(source => Boolean(source)),
    mergeMap(source => this.provider.get(source.path, source.params)),
    map(source => {
      const { data } = source;
      return data;
    }),
    catchError(this.handleError),
  );

  private createActionSubject = new Subject<T>();
  createAction$ = this.createActionSubject.asObservable();

  allEntityWithCreate$ = merge(
    this.allEntity$,
    this.createAction$
  ).pipe(scan((list: T[], value: T) => [...list, value]));

  constructor(
    private builder: ISerializableBuilder<T>,
    private provider: IEntityServiceProvider
  ) { }

  /**
   * @description Sends a /GET request to the data provider with query parameters if any
   * @param request [[GetAllReq]]
   */
  getAll = async (request: GetAllReq) => {
    this.allEntitySubject.next(request);
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
