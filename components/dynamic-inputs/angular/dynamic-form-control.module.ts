import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormControlComponent } from './components/dynamic-form-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClarityModule } from '@clr/angular';
import { DynamicFormWapperComponent } from './components/dynamic-form-wapper/dynamic-form-wapper.component';
import { DynamicRepetableGroupComponent } from './components/dynamic-repetable-group/dynamic-repetable-group.component';
import { RepeatableGroupChildComponent } from './components/dynamic-repetable-group/repeatable-group-child/repeatable-group-child.component';
import { DynamicFileInputComponent } from './components/dynamic-file-input/dynamic-file-input.component';
import { DynamicSelectInputComponent } from './components/dynamic-select-input/dynamic-select-input.component';
import { DynamicPhoneInputComponent } from './components/dynamic-phone-input/dynamic-phone-input.component';
import { DynamicDateInputComponent } from './components/dynamic-date-input/dynamic-date-input.component';
import { DynamicTextAreaInputComponent } from './components/dynamic-text-area-input/dynamic-text-area-input.component';
import { DynamicNumberInputComponent } from './components/dynamic-number-input/dynamic-number-input.component';
import { DynamicTextInputComponent } from './components/dynamic-text-input/dynamic-text-input.component';
import { DynamicPasswordInputComponent } from './components/dynamic-password-input/dynamic-password-input.component';
import { DynamicCheckoxInputComponent } from './components/dynamic-checkox-input/dynamic-checkox-input.component';
import { DynamicRadioInputComponent } from './components/dynamic-radio-input/dynamic-radio-input.component';
import { SimpleDynamicFormComponent } from './components/simple-dynamic-form/simple-form.component';
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
import { FORM_CLIENT, ANGULAR_REACTIVE_FORM_BRIDGE } from './types';
import { JSONFormsClient } from './services/client';
import { initializeDynamicFormContainer } from './helpers/module';
import { CacheProvider, FormsLoader } from '../core';
import { API_BINDINGS_ENDPOINT, API_HOST } from './tokens';

export const DECLARATIONS = [
  DynamicFormControlComponent,
  DynamicFormWapperComponent,
  DynamicRepetableGroupComponent,
  RepeatableGroupChildComponent,
  DynamicFileInputComponent,
  DynamicSelectInputComponent,
  DynamicPhoneInputComponent,
  DynamicDateInputComponent,
  DynamicTextAreaInputComponent,
  DynamicNumberInputComponent,
  DynamicTextInputComponent,
  DynamicPasswordInputComponent,
  DynamicCheckoxInputComponent,
  DynamicRadioInputComponent,
  SimpleDynamicFormComponent,
];

export type ModuleConfigs = {
  serverConfigs: {
    host?: string;
    controlOptionsPath?: string;
    controlsPath?: string;
    formsPath?: string;
    controlBindingsPath?: string;
  };
  formsAssets?: string;
  clientFactory?: Function;
  uploadedFilesServerURL?: string;
  dropzoneConfigs: DropzoneConfig;
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
export class DynamicFormControlModule {
  static forRoot(configs: ModuleConfigs) {
    return {
      ngModule: DynamicFormControlModule,
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
          useValue: configs?.serverConfigs?.host || null,
        },
        {
          provide: API_BINDINGS_ENDPOINT,
          useValue:
            configs?.serverConfigs?.controlBindingsPath || 'control-bindings',
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (service: CacheProvider) =>
            initializeDynamicFormContainer(
              service,
              configs?.formsAssets || '/assets/resources/app-forms.json'
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
          useValue: configs?.dropzoneConfigs ?? {
            url: configs?.serverConfigs?.host ?? 'http://localhost',
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
          useValue: configs?.uploadedFilesServerURL ?? 'http://localhost',
        },
      ],
    };
  }
}
