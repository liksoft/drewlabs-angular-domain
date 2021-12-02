import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "../../../../validators/validators";
import {
  CheckboxItem,
  IDynamicForm,
  IHTMLFormControl,
  InputTypes,
} from "../../core/contracts";
import { CheckBoxInput, DateInput, NumberInput, TextInput } from "../../core";
import { MomentUtils } from "../../../../utils/datetime";
import { observableOf } from "../../../../rxjs/helpers";
import { tap } from "rxjs/operators";

/**
 * @description Helper class for generating angular reactive form controls with errors validation
 */
export class ComponentReactiveFormHelpers {
  /**
   * @description Generate an abstract form control using input configuration
   *
   * @param builder Angular forms reactive formbuilder
   * @param input dynamic input configuration
   */
  static buildFormGroupFromInputConfig = (
    builder: FormBuilder,
    input: IHTMLFormControl[]
  ) => {
    const group = builder.group({});
    input.map((config: IHTMLFormControl) => {
      if (config.type !== InputTypes.CHECKBOX_INPUT) {
        const validators = [
          config.rules && config.rules.isRequired
            ? Validators.required
            : Validators.nullValidator,
        ];
        const asyncValidators: AsyncValidatorFn[] = [];
        if (
          config.type === InputTypes.TEXT_INPUT ||
          config.type === InputTypes.EMAIL_INPUT ||
          config.type === InputTypes.PASSWORD_INPUT
        ) {
          // Checks if maxlength rule is set to true and apply the rule to the input
          config.rules && config.rules.maxLength
            ? validators.push(
                Validators.maxLength(
                  (config as TextInput)?.maxLength
                    ? (config as TextInput).maxLength || Math.pow(2, 31) - 1
                    : 255
                )
              )
            : // tslint:disable-next-line:no-unused-expression
              null,
            // Checks if maxlength rule is set to true and apply the rule to the input
            config.rules && config.rules.minLength
              ? validators.push(
                  Validators.minLength(
                    (config as TextInput)?.minLength
                      ? (config as TextInput).minLength || 1
                      : 255
                  )
                )
              : // tslint:disable-next-line:no-unused-expression
                null;
          config.rules && config.rules.email
            ? validators.push(Validators.email)
            : // tslint:disable-next-line:no-unused-expression
              null;
          config.rules && config.rules.pattern
            ? validators.push(
                Validators.pattern((config as TextInput).pattern || "")
              )
            : // tslint:disable-next-line:no-unused-expression
              null;
        }
        // Check for min an max rules on number inputs and apply validation to the input
        if (config.type === InputTypes.NUMBER_INPUT) {
          config.rules && config.rules.min
            ? validators.push(
                Validators.min(
                  (config as NumberInput)?.min
                    ? (config as NumberInput).min
                    : -1
                )
              )
            : // tslint:disable-next-line:no-unused-expression
              null,
            // Checks if maxlength rule is set to true and apply the rule to the input
            config.rules && config.rules.max
              ? validators.push(
                  Validators.max(
                    (config as NumberInput)?.max
                      ? (config as NumberInput).max || Math.pow(2, 31) - 1
                      : Math.pow(2, 31) - 1
                  )
                )
              : // tslint:disable-next-line:no-unused-expression
                null;
        }
        // Validation rules form date input
        if (config.type === InputTypes.DATE_INPUT) {
          config.rules && config.rules.minDate
            ? validators.push(
                CustomValidators.minDate(
                  (config as DateInput)?.minDate
                    ? MomentUtils.parseDate(
                        (config as DateInput).minDate as string,
                        undefined,
                        "YYYY-MM-DD"
                      )
                    : MomentUtils.parseDate()
                )
              )
            : // tslint:disable-next-line:no-unused-expression
              null,
            // Checks if maxlength rule is set to true and apply the rule to the input
            config.rules && config.rules.maxDate
              ? validators.push(
                  CustomValidators.maxDate(
                    (config as DateInput)?.maxDate
                      ? MomentUtils.parseDate(
                          (config as DateInput).maxDate,
                          undefined,
                          "YYYY-MM-DD"
                        )
                      : MomentUtils.parseDate()
                  )
                )
              : // tslint:disable-next-line:no-unused-expression
                null;
        }
        // Add formControl to the form group with the generated validation rules
        const control = builder.control(
          {
            value: config.value,
            disabled: config.disabled,
          },
          asyncValidators.length > 0 || config.type === InputTypes.DATE_INPUT
            ? {
                validators: Validators.compose(validators),
                updateOn: "blur",
                asyncValidators,
              }
            : {
                validators: Validators.compose(validators),
              }
        );
        group.addControl(
          config.formControlName,
          control
          // Add other necessary validators
        );
      } else {
        // Build list of checkboxes
        const array: FormArray = new FormArray([]);
        observableOf((config as CheckBoxInput).items)
          .pipe(
            tap((items) => {
              items.map((it: CheckboxItem, index: number) => {
                // Added validation rule to checkbox array
                (array as FormArray).push(builder.control(it.checked));
              });
            })
          )
          .subscribe();
        // Add FormArray control to the formGroup
        if (config.rules && config.rules.isRequired) {
          array.setValidators(Validators.required);
        }
        group.addControl(config.formControlName, array);
      }
    });
    return group;
  };

  /**
   * Loop through formGroup controls and mark them as touched
   * @param control [[FormGroup|FormArray]] Reference to component formGroup object
   */
  public static validateFormGroupFields(control: FormGroup | FormArray): void {
    Object.keys(control.controls).forEach((field: string) => {
      if (control.get(field) instanceof FormGroup) {
        ComponentReactiveFormHelpers.validateFormGroupFields(
          control.get(field) as FormGroup
        );
      } else {
        ComponentReactiveFormHelpers.markControlAsTouched(
          control.get(field) || undefined,
          field
        );
      }
    });
  }
  /**
   * Mark control as touched them as touched
   * @param formGroup [[AbstractControl]] reference to form control
   */
  public static markControlAsTouched(
    control?: AbstractControl,
    field?: string
  ): void {
    if (control) {
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
      control?.markAsPristine({ onlySelf: true });
    }
  }

  /**
   * @description Clear validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static clearControlValidators(control?: AbstractControl): void {
    control?.clearValidators();
    control?.updateValueAndValidity();
  }

  /**
   * @description Clear async validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static clearAsyncValidators(control?: AbstractControl): void {
    control?.clearAsyncValidators();
    control?.updateValueAndValidity();
  }
  /**
   * @description Set new validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static setValidators(
    control?: AbstractControl,
    validators?: ValidatorFn | ValidatorFn[]
  ): void {
    control?.setValidators(validators || null);
    control?.updateValueAndValidity();
  }
}

/**
 * @description Build an angular form group from a dynamic form instance
 *
 * @param builder
 * @param form
 */
export const createAngularAbstractControl = (
  builder: FormBuilder,
  form?: IDynamicForm
) => {
  return form
    ? (ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(builder, [
        ...(form?.controlConfigs as Array<IHTMLFormControl>),
      ]) as FormGroup)
    : undefined;
};
