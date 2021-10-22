import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { createSubject } from "../helpers";
import { DECORATOR_APPLIED, DESTROY } from "./internals";

// This will be provided through Terser global definitions by Angular CLI. This will
// help to tree-shake away the code unneeded for production bundles.
declare const ngDevMode: boolean;

/**
 * If we use the `untilDestroyed` operator multiple times inside the single
 * instance providing different `destroyMethodName`, then all streams will
 * subscribe to the single subject. If any method is invoked, the subject will
 * emit and all streams will be unsubscribed. We wan't to prevent this behavior,
 * thus we store subjects under different symbols.
 */
function getSymbol<T>(destroyMethodName?: keyof T): symbol {
  if (typeof destroyMethodName === "string") {
    return Symbol(`__destroy__${destroyMethodName}`);
  } else {
    return DESTROY;
  }
}

function completeSubjectOnTheInstance(
  instance: any,
  symbol: symbol
): void {
  if (instance[symbol]) {
    instance[symbol].next();
    instance[symbol].complete();
    // We also have to re-assign this property thus in the future
    // we will be able to create new subject on the same instance.
    instance[symbol] = null;
  }
}

function createSubjectOnTheInstance(
  instance: any,
  symbol: symbol
): void {
  if (!instance[symbol]) {
    instance[symbol] = createSubject();
  }
}

function overrideNonDirectiveInstanceMethod(
  instance: any,
  destroyMethodName: string,
  symbol: symbol
): void {
  const originalDestroy = instance[destroyMethodName];

  if (ngDevMode && typeof originalDestroy !== "function") {
    throw new Error(
      `${instance.constructor.name} is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  createSubjectOnTheInstance(instance, symbol);

  instance[destroyMethodName] = function () {
    // eslint-disable-next-line prefer-rest-params
    originalDestroy.apply(this, arguments);
    completeSubjectOnTheInstance(this, symbol);
    // We have to re-assign this property back to the original value.
    // If the `untilDestroyed` operator is called for the same instance
    // multiple times, then we will be able to get the original
    // method again and not the patched one.
    instance[destroyMethodName] = originalDestroy;
  };
}

function ensureClassIsDecorated(instance: InstanceType<any>): never | void {
  const prototype = Object.getPrototypeOf(instance);
  const missingDecorator = !(DECORATOR_APPLIED in prototype);

  if (missingDecorator) {
    throw new Error(
      "untilDestroyed operator cannot be used inside directives or " +
        "components or providers that are not decorated with UntilDestroy decorator"
    );
  }
}

export function untilDestroyed<T>(instance: T, destroyMethodName?: keyof T) {
  return <U>(source: Observable<U>) => {
    const symbol = getSymbol<T>(destroyMethodName);

    // If `destroyMethodName` is passed then the developer applies
    // this operator to something non-related to Angular DI system
    if (typeof destroyMethodName === "string") {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol);
    } else {
      ngDevMode && ensureClassIsDecorated(instance);
      createSubjectOnTheInstance(instance, symbol);
    }

    return source.pipe(takeUntil<U>((instance as any)[symbol]));
  };
}
