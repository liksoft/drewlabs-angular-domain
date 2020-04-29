import { ModuleWithProviders, NgModule } from '@angular/core';
import { AbstractReducersService } from './reducer-interface';
import { Store, StoreFactory } from './store';

@NgModule()
export class StoreModule {
  static forRoot(): ModuleWithProviders<StoreModule> {
    return {
      ngModule: StoreModule,
      providers: [
        {
          provide: Store,
          useFactory: StoreFactory,
          deps: [AbstractReducersService],
          multi: false
        }
      ]
    };
  }
}
