import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormControlComponent } from './dynamic-form-control.component';
import { HTMLFormControlService } from './dynamic-input.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule} from '@ng-select/ng-select';
import { IntlTelInputModule } from 'src/app/lib/domain/components/intl-tel-input';
import { ClarityModule } from '@clr/angular';
import { DynamicFormWapperComponent } from './dynamic-form-wapper/dynamic-form-wapper.component';
import { DropzoneModule } from '../../dropzone/dropzone.module';
import { DynamicRepetableGroupComponent } from './dynamic-repetable-group/dynamic-repetable-group.component';
import { RepeatableGroupChildComponent } from './dynamic-repetable-group/repeatable-group-child/repeatable-group-child.component';
import { CustomPipesModule } from '../../pipes';


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
    CustomPipesModule
  ],
  declarations: [
    DynamicFormControlComponent,
    DynamicFormWapperComponent,
    // SafeWebContentPipe,
    DynamicRepetableGroupComponent,
    RepeatableGroupChildComponent,
    // SafeRessourceContentPipe
  ],
  exports: [
    DynamicFormControlComponent, DynamicFormWapperComponent, DynamicRepetableGroupComponent
  ],
  providers: []
})
export class DynamicFormControlModule {
  static forRoot(): ModuleWithProviders<DynamicFormControlModule> {
    return {
      ngModule: DynamicFormControlModule,
      providers: [HTMLFormControlService]
    };
  }
}
