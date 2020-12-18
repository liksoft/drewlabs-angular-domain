import { AbstractControl, FormGroup, FormArray, FormControl, ValidatorFn, Validators, FormBuilder, AsyncValidatorFn } from '@angular/forms';
import { InputTypes } from '../contracts/input-types';
import { CheckBoxInput, CheckboxItem, DateInput, NumberInput, TextInput } from '../input-types';
import { MomentUtils } from '../../../../utils';
import { isDefined } from '../../../../utils/types/type-utils';
import { CustomValidators, UniqueValueService } from '../../../../validators/validators';
import { IDynamicForm, IHTMLFormControl } from '..';
import { isGroupOfIDynamicForm } from './dynamic-form-helpers';
import { ICollection } from '../../../../contracts/collection-interface';


/**
 * @description Build an angular form group from a dynamic form instance
 * @param builder [[FormBuilder]]
 * @param form [[IDynamicForm]]
 * @param applyRequiredRules [[boolean]]
 */
export function angularAbstractControlFormDynamicForm(
  builder: FormBuilder,
  form: IDynamicForm,
  uniqueValidator: UniqueValueService = null
): AbstractControl {
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

/**
 * @description Build a formgroup from a collection of dynamic inputs
 * @param builder [[FormBuilder]]
 * @param collection [[ICollection<IDynamicForm>]]
 */
export function formGroupFromCollectionOfDynamicControls(
  builder: FormBuilder,
  collection: ICollection<IDynamicForm>,
  uniqueValidator: UniqueValueService = null
): FormGroup {
  const group = builder.group({});
  collection.keys().forEach((k) => {
    group.addControl(k,
      angularAbstractControlFormDynamicForm(builder, collection.get(k), uniqueValidator)
    );
  });
  return group;
}
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
        // const array: FormArray = new FormArray([]);
        const items = [...(config as CheckBoxInput).items];
        const array = new FormArray(items.map((it: CheckboxItem, index: number) => {
          // Added validation rule to checkbox array
          return fb.control(it.checked);
        }));
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

/**
 * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
 * @param control AbstractControl
 * @returns AbstractControl
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
