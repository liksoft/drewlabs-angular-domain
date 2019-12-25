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
import { SafeWebContentPipe } from '../../../pipes/safe-web-content.pipe';
import { DropzoneModule } from '../../dropzone/dropzone.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    IntlTelInputModule.forRoot(),
    TranslateModule,
    ClarityModule,
    DropzoneModule
  ],
  declarations: [DynamicFormControlComponent, DynamicFormWapperComponent, SafeWebContentPipe],
  exports: [DynamicFormControlComponent, DynamicFormWapperComponent, SafeWebContentPipe],
  providers: []
})
export class DynamicFormControlModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicFormControlModule,
      providers: [HTMLFormControlService]
    };
  }
}
