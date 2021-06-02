import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { of } from "rxjs";
import { MomentUtils } from "../../../utils/datetime/moment-utils";
import { isArray, isDefined } from "../../../utils/types/type-utils";
import { CustomValidators, UniqueValueService } from "../../../validators/validators";
import { DynamicFormInterface } from "../core/compact/types";
import { IDynamicForm } from "../core/contracts/dynamic-form";
import { IHTMLFormControl } from "../core/contracts/dynamic-input";
import { InputTypes } from "../core/contracts/input-types";
import { DynamicForm } from "../core/dynamic-form";
import { isGroupOfIDynamicForm } from "../core/helpers";
import { CheckBoxInput, CheckboxItem, DateInput, NumberInput, TextInput, toDynamicControl } from "../core/input-types";

/**
 * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
 * @param control AbstractControl
 * 
 * @returns {AbstractControl}
 */
export function cloneAbstractControl<T extends AbstractControl>(control: T): T {
  let newControl: T;

  if (control instanceof FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    const controls = control.controls;

    Object.keys(controls).forEach(key => {
      formGroup.addControl(key, cloneAbstractControl(controls[key]));
    });

    newControl = formGroup as any;
  } else if (control instanceof FormArray) {
    const formArray = new FormArray([], control.validator, control.asyncValidator);

    control.controls.forEach(formControl => formArray.push(cloneAbstractControl(formControl)));

    newControl = formArray as any;
  } else if (control instanceof FormControl) {
    newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
  } else {
    throw new Error('Error: unexpected control value');
  }

  if (control.disabled) { newControl.disable({ emitEvent: false }); }

  return newControl;
}

/**
 * @description Build an angular form group from a dynamic form instance
 * @param builder [[FormBuilder]]
 * @param form [[IDynamicForm]]
 * @param applyRequiredRules [[boolean]]
 */
 export function createAngularAbstractControl( builder: FormBuilder, form: IDynamicForm, uniqueValidator: UniqueValueService = null ): AbstractControl {
  if (!isDefined(form)) {
    return null;
  }
  const c = [...form.controlConfigs as Array<IHTMLFormControl>];
  if (isGroupOfIDynamicForm(form)) {
    (form as IDynamicForm).forms.forEach((v) => {
      c.push(...(v.controlConfigs ? (v.controlConfigs as Array<IHTMLFormControl>) : []));
    });
  }
  const formGroup: FormGroup = (ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
    builder,
    c,
    uniqueValidator
  ) as FormGroup);
  return formGroup;
}


export class DynamicFormHelpers {
  /**
   * @description Create an instance of [[IDynamicForm]] from a [[Form]] instance
   * The method tries to translate prossible translatable label
   * @param form [[Form]]
   */
  public static buildDynamicForm(form: Partial<DynamicFormInterface>): Promise<IDynamicForm> {
    return new Promise((resolve, _) => {
      const generatorFn = (f: Partial<DynamicFormInterface>) => {
        let configs: IHTMLFormControl[] = [];
        if (isArray(f.formControls) && (f.formControls.length > 0)) {
          configs = f.formControls.map((control) => {
            const config = toDynamicControl(control);
            // tslint:disable-next-line: max-line-length
            return { ...config };
          });
        }
        let forms = f.children && f.children.length ? [] : f.children.map(value => generatorFn(value));
        return new DynamicForm({
          id: f.id,
          title: f.title,
          description: f.description,
          endpointURL: f.url,
          controlConfigs: configs,
          forms
        });

      };
      resolve(generatorFn(form))
    });
  }
}

/**
 * Helper class for generating angular reactive form controls with errors validation
 */
export class ComponentReactiveFormHelpers {
  /**
   * Generate an abstract form control using input configuration
   * @param fb [[FormBuilder]] Angular forms reactive formbuilder
   * @param input [[DynamicInput]] dynamic input configuration
   */
  public static buildFormGroupFromInputConfig(
    fb: FormBuilder,
    input: IHTMLFormControl[],
    uniqueValidator: UniqueValueService = null
  ): AbstractControl {
    const group = fb.group({});
    input.map((config: IHTMLFormControl) => {
      if (config.type !== InputTypes.CHECKBOX_INPUT) {
        const validators = [
          config.rules && config.rules.isRequired ? Validators.required : Validators.nullValidator
        ];
        const asyncValidators: AsyncValidatorFn[] = [];
        if (
          config.type === InputTypes.TEXT_INPUT ||
          config.type === InputTypes.EMAIL_INPUT ||
          config.type === InputTypes.PASSWORD_INPUT
        ) {
          // Checks if maxlength rule is set to true and apply the rule to the input
          if (isDefined(uniqueValidator) &&
            isDefined(config.rules) &&
            isDefined(config.rules.notUnique) &&
            isDefined(config.uniqueCondition)) {
            const parts = config.uniqueCondition.split(':');
            if (parts.length === 2) {
              config.rules && config.rules.notUnique
                ? asyncValidators.push(
                  CustomValidators.createAsycUniqueValidator(
                    uniqueValidator,
                    // First entry in the array is the table name
                    parts[0],
                    // Second is the column name in the table
                    parts[1]
                  )
                )
                : // tslint:disable-next-line:no-unused-expression
                null;
            }
          }
          // Checks if maxlength rule is set to true and apply the rule to the input
          config.rules && config.rules.maxLength
            ? validators.push(
              Validators.maxLength(
                isDefined((config as TextInput).maxLength)
                  ? (config as TextInput).maxLength
                  : 255
              )
            )
            : // tslint:disable-next-line:no-unused-expression
            null,
            // Checks if maxlength rule is set to true and apply the rule to the input
            config.rules && config.rules.minLength
              ? validators.push(
                Validators.minLength(
                  isDefined((config as TextInput).minLength)
                    ? (config as TextInput).minLength
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
            ? validators.push(Validators.pattern((config as TextInput).pattern))
            : // tslint:disable-next-line:no-unused-expression
            null;
        }
        // Check for min an max rules on number inputs and apply validation to the input
        if (config.type === InputTypes.NUMBER_INPUT) {
          config.rules && config.rules.min
            ? validators.push(
              Validators.min(
                isDefined((config as NumberInput).min)
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
                  isDefined((config as NumberInput).max)
                    ? (config as NumberInput).max
                    : (Math.pow(2, 31) - 1)
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
                isDefined((config as DateInput).minDate)
                  ? MomentUtils.parseDate((config as DateInput).minDate as string, null, 'YYYY-MM-DD')
                  : MomentUtils.parseDate()
              )
            )
            : // tslint:disable-next-line:no-unused-expression
            null,
            // Checks if maxlength rule is set to true and apply the rule to the input
            config.rules && config.rules.maxDate
              ? validators.push(
                CustomValidators.maxDate(
                  isDefined((config as DateInput).maxDate)
                    ? MomentUtils.parseDate((config as DateInput).maxDate, null, 'YYYY-MM-DD')
                    : MomentUtils.parseDate()
                )
              )
              : // tslint:disable-next-line:no-unused-expression
              null;
        }
        // Add formControl to the form group with the generated validation rules
        group.addControl(
          config.formControlName,
          // new FormControl(), //
          fb.control(
            {
              value: config.value,
              disabled: config.disabled
            },
            (asyncValidators.length > 0) || (config.type === InputTypes.DATE_INPUT) ? {
              validators: Validators.compose(validators),
              updateOn: 'blur',
              asyncValidators
            } : {
                validators: Validators.compose(validators)
              }
          )
          // Add other necessary validators
        );
      } else {
        // Build list of checkboxes
        const array: FormArray = new FormArray([]);
        of((config as CheckBoxInput).items).subscribe(items => {
          items.map((it: CheckboxItem, index: number) => {
            // Added validation rule to checkbox array
            (array as FormArray).push(fb.control(it.checked));
          });
        });
        // Add FormArray control to the formGroup
        if (config.rules && config.rules.isRequired) {
          array.setValidators(Validators.required);
        }
        group.addControl(config.formControlName, array);
      }
    });
    return group;
  }

  /**
   * Loop through formGroup controls and mark them as touched
   * @param control [[FormGroup|FormArray]] Reference to component formGroup object
   */
  public static validateFormGroupFields(control: FormGroup | FormArray): void {
    Object.keys(control.controls).forEach((field: string) => {
      if (control.get(field) instanceof FormGroup) {
        ComponentReactiveFormHelpers.validateFormGroupFields(control.get(field) as FormGroup);
      } else {
        ComponentReactiveFormHelpers.markControlAsTouched(control.get(field), field);
      }
    });
  }
  /**
   * Mark control as touched them as touched
   * @param formGroup [[AbstractControl]] reference to form control
   */
  public static markControlAsTouched(control: AbstractControl, field: string = null): void {
    if (isDefined(control)) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
      control.markAsPristine({ onlySelf: true });
    }

  }

  /**
   * @description Clear validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static clearControlValidators(control: AbstractControl): void {
    if (isDefined(control)) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  /**
   * @description Clear async validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static clearAsyncValidators(control: AbstractControl): void {
    if (isDefined(control)) {
      control.clearAsyncValidators();
      control.updateValueAndValidity();
    }
  }
  /**
   * @description Set new validators on a control and update it value and validation rules
   * @param control [[AbstractControl]]
   */
  public static setValidators(control: AbstractControl, validators: ValidatorFn | ValidatorFn[]): void {
    if (isDefined(control)) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }
}