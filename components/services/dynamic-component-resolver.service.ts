import {
  ComponentFactoryResolver,
  ViewContainerRef,
  Inject,
  Injectable,
  ComponentFactory,
  Type
} from '@angular/core';

@Injectable()
export class DynamicComponentService<T> {
  /**
   * @param resolver Angular component resolver provider [[ComponentFactoryResolver]]
   */
  constructor(
    @Inject(ComponentFactoryResolver)
    private resolver: ComponentFactoryResolver
  ) {}

  /**
   * @description Create dynamic components attachable to the DOM
   * @param container Reference of the view container [[ViewContainerRef]]
   * @param componentRef Component reference [[Type<T>]]
   */
  createComponent(container: ViewContainerRef, componentRef: Type<T>) {
    const factory: ComponentFactory<T> = this.resolver.resolveComponentFactory(
      componentRef
    );
    return container.createComponent(factory);
  }
}
