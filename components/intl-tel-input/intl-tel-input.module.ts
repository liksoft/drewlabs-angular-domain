import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntlTelInputComponent } from './intl-tel-input.component';
import { IntlTelInputService } from './intl-tel-input.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
// import { DrewlabsDisableControlDirective } from '../../directives/disable-control.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClarityModule,
    ScrollingModule
  ],
  declarations: [
    IntlTelInputComponent
  ],
  exports: [
    IntlTelInputComponent
  ]
})
export class IntlTelInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IntlTelInputModule,
      providers: [IntlTelInputService]
    };
  }
}
