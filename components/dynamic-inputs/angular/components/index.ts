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
import { DynamicFormControlComponent } from './dynamic-form-control.component';

export const DECLARATIONS = [
  DynamicFormControlComponent,
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
];

// Exports
export { CheckoxInputComponent as DynamicCheckoxInputComponent } from './checkox-input/checkox-input.component';
export { DateInputComponent as DynamicDateInputComponent } from './date-input/date-input.component';
