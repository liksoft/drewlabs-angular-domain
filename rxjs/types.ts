import {
  Observable,
  Subject,
  Subscriber,
  TeardownLogic,
  BehaviorSubject,
} from "rxjs";
import { Paginable } from "../pagination";

// Creates a new observable subject
export type GenericCreateSubjectFunc<T> = (
  param?: T
) => Subject<T> | BehaviorSubject<T>;
/**
 * @description Type definition for parameter passed to createObservable function
 */
export type GenericObserverHandlerFunc<T> = (
  subscriber: Subscriber<T>
) => TeardownLogic;

/**
 * @description Create observable type definition
 */
export type GenericCreateObservableFunc<T> = (
  handler?: GenericObserverHandlerFunc<T>
) => Observable<T>;

/**
 * @description Type definition for result of a given handler function
 */
export type HandlerResult<T> = { data: T };

/**
 * @description Reexported type pagination state
 */
export type PaginationDataState<T> = Paginable<T>;
