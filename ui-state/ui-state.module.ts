import { ModuleWithProviders, NgModule } from '@angular/core';
import { UI_STATE_PROVIDER } from './types';
import { AppUIStateProvider } from './ui-state.service';

@NgModule()
export class UIStateModule {
  static forRoot(): ModuleWithProviders<UIStateModule> {
    return {
      ngModule: UIStateModule,
      providers: [
        AppUIStateProvider,
        {
          provide: UI_STATE_PROVIDER,
          useClass: AppUIStateProvider,
        },
      ],
    };
  }
}
