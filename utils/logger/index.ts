import { FormGroup } from "@angular/forms";

// Wrapper arround Javascript console.log method
export const Log = console.log;

// Wrapper arround JS console.error object for printing error
// to the console
export const Err = console.error;


export const logFormGroupControlsStatus = (control: FormGroup) => {
  Object.keys(control.controls).forEach((field: string) => {
    if (control.get(field) instanceof FormGroup) {
      logFormGroupControlsStatus(control.get(field) as FormGroup);
    }
  });
}
