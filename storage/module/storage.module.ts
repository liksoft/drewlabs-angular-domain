import { NgModule, ModuleWithProviders } from '@angular/core';
import { InMemoryStoreService, LocalStorage, SessionStorage } from '../core';

@NgModule()
export class StorageModule {
  static forRoot(configs: {secretKey: string}): ModuleWithProviders<StorageModule> {
    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: 'APP_SECRET',
          useValue: configs.secretKey || 'ELEWOU_SECRET_KEY'
        },
        LocalStorage,
        SessionStorage,
        InMemoryStoreService
      ]
    };
  }
}
