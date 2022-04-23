import { FileInputComponent } from './file-input/file-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { DynamicTextAreaInputComponent } from './textarea-input/textarea-input.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { TextInputComponent } from './text-input/text-input.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { CheckoxInputComponent } from './checkox-input/checkox-input.component';
import { RadioInputComponent } from './radio-input/radio-input.component';
import { NgxSmartFormComponent } from './ngx-smart-form/ngx-smart-form.component';
import { NgxSmartFormGroupComponent } from './ngx-smart-form-group/ngx-smart-form-group.component';
import { NgxSmartFormArrayComponent } from './ngx-smart-form-array/ngx-smart-form-array.component';
import { NgxSmartFormArrayChildComponent } from './ngx-smart-form-array/ngx-smart-form-array-child.component';
import { NgxSmartFormControlComponent } from './ngx-smart-form-control/ngx-smart-form-control.component';
import { NgxSmartFormGroupHeaderPipe } from './ngx-smart-form-group/ngx-smart-form-group-header.pipe';

export const DECLARATIONS = [
  // Inputs
  FileInputComponent,
  SelectInputComponent,
  PhoneInputComponent,
  DateInputComponent,
  DynamicTextAreaInputComponent,
  NumberInputComponent,
  TextInputComponent,
  PasswordInputComponent,
  CheckoxInputComponent,
  RadioInputComponent,

  // Smart form related components
  NgxSmartFormComponent,
  NgxSmartFormGroupComponent,
  NgxSmartFormArrayComponent,
  NgxSmartFormArrayChildComponent,
  NgxSmartFormControlComponent,

  // Pipes
  NgxSmartFormGroupHeaderPipe
];

// Exports
export { CheckoxInputComponent } from './checkox-input/checkox-input.component';
export { DateInputComponent } from './date-input/date-input.component';
