import { NgModule, ModuleWithProviders } from '@angular/core';
import { DataStoreService, LocalStorage, SessionStorage } from '../core';

@NgModule({
  declarations: [
  ],
  imports: [],
  exports: [],
  providers: [],
  bootstrap: []
})
export class StorageModule {
  static forRoot(): ModuleWithProviders<StorageModule> {
    return {
      ngModule: StorageModule,
      providers: [
        LocalStorage,
        SessionStorage,
        DataStoreService
      ]
    };
  }
}
