import { NgModule, ModuleWithProviders, APP_INITIALIZER } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicFormControlComponent } from "./components/dynamic-form-control.component";
import { TranslateModule } from "@ngx-translate/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { ClarityModule } from "@clr/angular";
import { DynamicFormWapperComponent } from "./components/dynamic-form-wapper/dynamic-form-wapper.component";
import { DynamicRepetableGroupComponent } from "./components/dynamic-repetable-group/dynamic-repetable-group.component";
import { RepeatableGroupChildComponent } from "./components/dynamic-repetable-group/repeatable-group-child/repeatable-group-child.component";
import { DynamicFileInputComponent } from "./components/dynamic-file-input/dynamic-file-input.component";
import { DynamicSelectInputComponent } from "./components/dynamic-select-input/dynamic-select-input.component";
import { DynamicPhoneInputComponent } from "./components/dynamic-phone-input/dynamic-phone-input.component";
import { DynamicDateInputComponent } from "./components/dynamic-date-input/dynamic-date-input.component";
import { DynamicTextAreaInputComponent } from "./components/dynamic-text-area-input/dynamic-text-area-input.component";
import { DynamicNumberInputComponent } from "./components/dynamic-number-input/dynamic-number-input.component";
import { DynamicTextInputComponent } from "./components/dynamic-text-input/dynamic-text-input.component";
import { DynamicPasswordInputComponent } from "./components/dynamic-password-input/dynamic-password-input.component";
import { DynamicCheckoxInputComponent } from "./components/dynamic-checkox-input/dynamic-checkox-input.component";
import { DynamicRadioInputComponent } from "./components/dynamic-radio-input/dynamic-radio-input.component";
import { SimpleDynamicFormComponent } from "./components/simple-dynamic-form/simple-form.component";
import { DropzoneModule } from "../../dropzone";
import { CustomPipesModule } from "../../pipes";
import { IntlTelInputModule } from "../../intl-tel-input";
import { DYNAMIC_FORM_LOADER, FormHttpLoader } from "./services";
import {
  AbstractDynamicFormService,
  DynamicFormService,
} from "./services/dynamic-form.service";

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
};

export const initializeDynamicFormContainer = (
  service: AbstractDynamicFormService,
  assetsURL: string
) => {
  return async () => {
    return await service
      .loadConfiguredForms(assetsURL || "/assets/resources/app-forms.json")
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
    CustomPipesModule,
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  providers: [],
})
export class DynamicFormControlModule {
  static forRoot(
    configs: ModuleConfigs = {} as ModuleConfigs
  ): ModuleWithProviders<DynamicFormControlModule> {
    return {
      ngModule: DynamicFormControlModule,
      providers: [
        {
          provide: "FORM_SERVER_HOST",
          useValue: configs?.serverConfigs?.host || null,
        },
        {
          provide: "FORM_RESOURCES_PATH",
          useValue: configs?.serverConfigs?.formsPath || "forms",
        },
        {
          provide: "FORM_CONTROL_RESOURCES_PATH",
          useValue: configs?.serverConfigs?.controlsPath || "form-controls",
        },
        {
          provide: "FORM_FORM_CONTROL_RESOURCES_PATH",
          useValue:
            configs?.serverConfigs?.controlsPath || "form-form-controls",
        },
        {
          provide: "CONTROL_OPTION_RESOURCES_PATH",
          useValue:
            configs?.serverConfigs?.controlOptionsPath ||
            "form-control-options",
        },
        {
          provide: "CONTROL_BINDINGS_RESOURCES_PATH",
          useValue:
            configs?.serverConfigs?.controlBindingsPath || "control-bindings",
        },
        {
          provide: DYNAMIC_FORM_LOADER,
          useClass: FormHttpLoader,
        },
        {
          provide: AbstractDynamicFormService,
          useClass: DynamicFormService,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (service: AbstractDynamicFormService) =>
            initializeDynamicFormContainer(
              service,
              configs?.formsAssets || "/assets/resources/app-forms.json"
            ),
          multi: true,
          deps: [AbstractDynamicFormService],
        },
      ],
    };
  }
}
