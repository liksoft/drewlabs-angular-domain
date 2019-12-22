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
// import { FormService } from '../core/form-control/form.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    IntlTelInputModule.forRoot(),
    TranslateModule,
    ClarityModule
  ],
  declarations: [DynamicFormControlComponent, DynamicFormWapperComponent],
  exports: [DynamicFormControlComponent, DynamicFormWapperComponent],
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
