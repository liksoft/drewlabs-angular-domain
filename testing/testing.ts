import { defer, of, throwError } from 'rxjs';
import { DebugElement, Type } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

/**
 *  Create async observable that emits-once and completes
 * @param data Data stream to be emitted when completed
 */
export function asyncData<T>(data: T) {
  return defer(() => of(data));
}

/**
 * @description Create async observable error that errors
 * @param errorObject Error object that will be thrown
 */
export function asyncError<T extends any>(errorObject: T) {
  return defer(() => throwError(errorObject));
}

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

export const createTestComponent = <T>(type: Type<T>) => {
  // Mock hero supplied by the parent component
  const fixture = TestBed.createComponent(type);
  const component = fixture.componentInstance;
  // Simulate parent setting Hero
  const debugElement = fixture.debugElement;
  return { fixture, component, debugElement };
};


export class TestingComponentContainer<T, QueryElementType> {

  gotoListSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  spyMethods: { [index: number]: jasmine.Spy } = {};
  methodIndexes: { [index: number]: (keyof T) } = {};

  constructor(private fixture: ComponentFixture<T>, methodsToSpy?: (keyof T)[]) {
    // get the navigate spy from the injected router spy object
    const routerSpy = fixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;

    // spy on component's methods
    const component = fixture.componentInstance;
    methodsToSpy.forEach((method, index) => {
      this.methodIndexes[index] = method;
      this.spyMethods[index] = spyOn<T>(component, method as any).and.callThrough();
    });
  }

  public getSpyMethod(method: keyof T) {
    const index = Object.keys(this.methodIndexes).find((key) => this.methodIndexes[key] === method);
    if (index) {
      return this.spyMethods[index];
    }
    return null;
  }

  //// query helpers ////
  public query(selector: string): QueryElementType {
    return this.fixture.nativeElement.querySelector(selector);
  }

  public queryAll(selector: string): QueryElementType[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}

/**
 * @description Type helper to overcome type returned by the jasmine.createSpyObj
 */
export type SpyObj<T> = { [Method in keyof T]: jasmine.Spy; };
