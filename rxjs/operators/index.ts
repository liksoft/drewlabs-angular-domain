import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { getEnv } from "../../utils";
import { Log } from "../../utils/logger";

// This will be provided through Terser global definitions by Angular CLI. This will
// help to tree-shake away the code unneeded for production bundles.
declare const ngDevMode: boolean;

// Helper rxjs operator for logging emitted stream while running in development mode
/**
 * @description Helper rxjs operator for logging emitted stream while running in development mode
 * ```js
 * const stream$ = sourceStream$.pipe(
 *    doLog(),
 *    map(...),
 *    publishReplay()
 * );
 * ```
 */
export const doLog = <T>(prefix?: string) => {
  return (source$: Observable<T>) =>
    source$.pipe(
      tap((source) => {
        // tslint:disable-next-line: no-unused-expression
        ngDevMode ? (prefix ? Log(prefix, source) : Log(source)) : undefined;
      })
    );
};

export { untilDestroyed } from "./until-destroyed";
