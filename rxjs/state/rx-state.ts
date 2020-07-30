import { createSubject, observaleOf, isObservable } from '../helpers';
import { Observable } from 'rxjs';
import { scan, startWith, mergeMap, shareReplay, filter } from 'rxjs/operators';
import { doLog } from '../operators/index';
import { isDefined } from '../../utils/types/type-utils';

export interface StateAction {
  type: string;
  payload?: any;
}

export enum DefaultStoreAction {
  ASYNC_UI_ACTION = '[ASYNC_REQUEST]',
  ERROR_ACTION = '[REQUEST_ERROR]'
}

export type StateReducerFn<T, A> = (state: T, action: A) => T;

export type ActionCreatorHandlerFn<A, K> = (...params: K[]) => A;

export type ActionCreatorFn<A extends Partial<StateAction>, K> = (handlerFunc: (...params: K[]) => A) => A;

const instanceOfInjectableStore = (value: any) => 'getInjectedStore' in value;

export interface IInjectableStore<T, A extends Partial<StateAction>> {
  state$: Observable<T>;

  /**
   * @description Returns the inner flux store object
   */
  getInjectedStore(): DrewlabsFluxStore<T, A>;
}

export abstract class InjectableStore<T, A extends Partial<StateAction>> implements IInjectableStore<T, A> {
  get state$() {
    return this.getInjectedStore().connect();
  }

  abstract getInjectedStore(): DrewlabsFluxStore<T, A>;
}

export class DrewlabsFluxStore<T, AType extends Partial<StateAction>> {

  // tslint:disable-next-line: variable-name
  state$: Observable<T>;

  // tslint:disable-next-line: variable-name
  private _actions$ = createSubject<AType | Observable<AType>>();

  /**
   * @description EntityState instance initializer
   */
  constructor(reducer: StateReducerFn<T, AType>, initialState?: T) {
    this.state$ = this._actions$.pipe(
      mergeMap((action) => isObservable(action) ? action as Observable<AType> : observaleOf<AType>(action as AType)),
      filter(state => isDefined(state)),
      doLog('Action : '),
      startWith(initialState),
      scan(reducer),
      doLog('State : '),
      shareReplay(1)
    );
  }

  public bindActionCreator = <K>(handler: ActionCreatorHandlerFn<AType, K>) => (...args: any) => {
    const action = handler.call(null, ...args) as AType;
    this._actions$.next(action);
    if (isObservable(action.payload)) {
      this._actions$.next(action.payload);
    }
    return action;
  }

  /**
   * @description Connect to the store data stream
   */
  public connect = () => this.state$;
}


export function createAction<T, A, K>(
  rxStore: DrewlabsFluxStore<T, A> | IInjectableStore<T, A>, actionCreator: ActionCreatorHandlerFn<A, K>
) {
  if (instanceOfInjectableStore(rxStore)) {
    return (rxStore as IInjectableStore<T, A>).getInjectedStore().bindActionCreator<K>(actionCreator);
  }
  return (rxStore as DrewlabsFluxStore<T, A>).bindActionCreator<K>(actionCreator);
}

export const createStore = <T, K>(reducer: StateReducerFn<T, K>, initialState?: T) => {
  return new DrewlabsFluxStore(reducer, initialState);
};

export const onErrorAction = <T, A>(
  store: DrewlabsFluxStore<T, Partial<A>>) =>
  createAction(store, (payload: any) =>
    ({ type: DefaultStoreAction.ERROR_ACTION, payload } as any));
