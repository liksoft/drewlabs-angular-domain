import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClarityModule } from '@clr/angular';
import {
  DropzoneConfig,
  DropzoneModule,
  DROPZONE_CONFIG,
} from '../../dropzone';
import { IntlTelInputModule } from '../../intl-tel-input';
import {
  CACHE_PROVIDER,
  DYNAMIC_FORM_LOADER,
  FormHttpLoader,
  FormsCacheProvider,
  ReactiveFormBuilderBrige,
} from './services';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';
import { HttpModule } from '../../../http';
import { FORM_CLIENT, ANGULAR_REACTIVE_FORM_BRIDGE } from './types/tokens';
import { JSONFormsClient } from './services/client';
import { CacheProvider } from '../core';
import { API_BINDINGS_ENDPOINT, API_HOST } from './types/tokens';
import { DECLARATIONS } from './components';

type FormApiServerConfigs = {
  api: {
    host?: string;
    bindings?: string;
    uploadURL?: string;
  };
};

export type ModuleConfigs = {
  dropzoneConfigs?: DropzoneConfig;
  serverConfigs: FormApiServerConfigs;
  formsAssets?: string;
  clientFactory?: Function;
};

export const initializeDynamicFormContainer = (
  service: CacheProvider,
  assetsURL: string
) => {
  return async () => {
    return await service
      .cache(assetsURL || '/assets/resources/app-forms.json')
      .toPromise();
  };
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    IntlTelInputModule.forRoot(),
    TranslateModule,
    ClarityModule,
    DropzoneModule,
    HttpModule,
  ],
  declarations: [...DECLARATIONS, SafeHTMLPipe],
  exports: [...DECLARATIONS],
  providers: [],
})
export class NgxSmartFormModule {
  static forRoot(configs: ModuleConfigs) {
    return {
      ngModule: NgxSmartFormModule,
      providers: [
        FormHttpLoader,
        {
          provide: DYNAMIC_FORM_LOADER,
          useClass: FormHttpLoader,
        },
        FormsCacheProvider,
        {
          provide: CACHE_PROVIDER,
          useClass: FormsCacheProvider,
        },
        JSONFormsClient,
        {
          provide: FORM_CLIENT,
          useClass: JSONFormsClient,
        },
        ReactiveFormBuilderBrige,
        {
          provide: API_HOST,
          useValue: configs!.serverConfigs!.api.host || undefined,
        },
        {
          provide: API_BINDINGS_ENDPOINT,
          useValue: configs!.serverConfigs!.api.bindings || 'control-bindings',
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (service: CacheProvider) =>
            initializeDynamicFormContainer(
              service,
              configs!.formsAssets || '/assets/resources/app-forms.json'
            ),
          multi: true,
          deps: [CACHE_PROVIDER],
        },
        {
          provide: ANGULAR_REACTIVE_FORM_BRIDGE,
          useClass: ReactiveFormBuilderBrige,
        },
        {
          provide: DROPZONE_CONFIG,
          useValue: configs!.dropzoneConfigs ?? {
            url: configs!.serverConfigs!.api.host ?? 'http://localhost',
            maxFilesize: 10,
            acceptedFiles: 'image/*',
            autoProcessQueue: false,
            uploadMultiple: false,
            maxFiles: 1,
            addRemoveLinks: true,
          },
        },
        {
          provide: 'FILE_STORE_PATH',
          useValue: configs!.serverConfigs.api.uploadURL ?? 'http://localhost',
        },
      ],
    };
  }
}
