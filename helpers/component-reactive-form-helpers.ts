import {
  AbstractControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  IHTMLFormControl,
  IDynamicForm,
  isGroupOfIDynamicForm,
} from '../components/dynamic-inputs/core';
import { AppUIStoreManager } from './app-ui-store-manager.service';
import { Directive, EventEmitter, HostBinding } from '@angular/core';
import { AbstractAlertableComponent } from './component-interfaces';
import { TranslationService } from '../translator';
import { ICollection } from '../contracts/collection-interface';
import { UniqueValueService } from '../validators';
import { isDefined } from '../utils';
import { DynamicFormInterface } from '../components/dynamic-inputs/core/compact/types';
import { DynamicFormHelpers as CoreDynamicFormHelpers, ComponentReactiveFormHelpers, createAngularAbstractControl } from '../components/dynamic-inputs/angular';


/**
 * @description Defines an object passed to the form submission event
 */
export interface FormRequest {
  body: object | any;
  requestURL?: string;
  params?: object;
}

export interface UpdateRequest {
  id?: number | string;
  body: object | any;
  requestURL?: string;
  params?: object;
}
export interface DeleteRequest {
  id?: number | string;
  requestURL?: string;
  params?: object;
}


/**
 * @description Interface definition of a form submission event with the request url
 */
export interface InnerFormSubmissionEvent {
  index: number;
  requestURL?: string;
}

/**
 * @deprecated use {createAngularAbstractControl} method instead
 * @description Build an angular form group from a dynamic form instance
 * @param builder [[FormBuilder]]
 * @param form [[IDynamicForm]]
 * @param applyRequiredRules [[boolean]]
 */
export const angularAbstractControlFormDynamicForm = (
  builder: FormBuilder,
  form: IDynamicForm,
  uniqueValidator: UniqueValueService = null
) => createAngularAbstractControl(builder, form, uniqueValidator);

/**
 * @deprecated Will be removed in future versions
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

/**
 * @deprecated Will be removed in future versions
 */

export class TranslationHelpers {
  static translatableValuePrefixs: string[] = ['translations.', '__.'];

  /**
   * @description Checks if the string should be translated or not
   */
  public static shouldBetranslated(value: string): boolean {
    return (new RegExp(TranslationHelpers.translatableValuePrefixs.join('|')).test(value));
  }

  /**
   * @description Removes the translation part from the translation label
   * @param value [[string]]
   */
  public static trimtranslatableValue(value: string): string {
    if (value.startsWith(TranslationHelpers.translatableValuePrefixs[0])) {
      return value.substring(TranslationHelpers.translatableValuePrefixs[0].length);
    }
    if (value.startsWith(TranslationHelpers.translatableValuePrefixs[1])) {
      return value.substring(TranslationHelpers.translatableValuePrefixs[1].length);
    }
    return value;
  }
}

/**
 * @deprecated Will be removed in future versions
 */
export class DynamicFormHelpers {
  /**
   * @description Create an instance of [[IDynamicForm]] from a [[Form]] instance
   * The method tries to translate prossible translatable label
   * @param form [[Form]]
   * @param translate [[TranslatorService]]
   */
  public static async buildDynamicForm(form: Partial<DynamicFormInterface>, _: TranslationService) {
    return CoreDynamicFormHelpers.buildDynamicForm(form);
  }
}

/**
 * @deprecated Will be removed in future versions
 * @description This class provides components that extends from it with helper methods
 * for handling form submission, form validation, and form generations
 */
export abstract class BaseDynamicFormComponent extends AbstractAlertableComponent {
  public componentFormGroup: FormGroup;
  public form: IDynamicForm;
  public formSubmitted: EventEmitter<object> = new EventEmitter<object>();
  public cancelSubmission: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @description Component object instance initializer
   * @param builder [[FormBuilder]] Angular ReactiveForm FormBuilder
   * @param appUIStoreManager [[AppUIStoreManager]]
   */
  constructor(
    protected builder: FormBuilder,
    public appUIStoreManager: AppUIStoreManager
  ) {
    super(appUIStoreManager);
  }

  /**
   * @description Build an angular [[AbstractControl]] instance from dynamic form configurations
   */
  buildForm(applyRequiredRules: boolean = true): AbstractControl {
    if (!isDefined(this.form)) {
      return null;
    }
    const c = [...this.form.controlConfigs as Array<IHTMLFormControl>];
    if (this.isFormGroup(this.form)) {
      (this.form as IDynamicForm).forms.forEach((v) => {
        c.push(...(v.controlConfigs ? v.controlConfigs as Array<IHTMLFormControl> : []));
      });
    }
    const formGroup: FormGroup = (ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.builder,
      c,
    ) as FormGroup);
    return formGroup;
  }

  /**
   * @description Checks if the param is a FormGroup
   * @param f [[IDynamicForm]]
   */
  isFormGroup(f: IDynamicForm): boolean {
    return isGroupOfIDynamicForm(f);
  }

  /**
   * @description Validate a form group and return it back
   * @param formgroup [[FormGroup]]
   */
  validateAndReturnFormGroup(formgroup: FormGroup): FormGroup {
    // Mark componentFormGroup controls as touched
    ComponentReactiveFormHelpers.validateFormGroupFields(
      formgroup
    );
    return formgroup;
  }

  /**
   * @description Emit form submission with a given form value
   * @param formgroup [[FormGroup]]
   * @param requestURL [[string]]
   */
  submitFormGroupValue(formgroup: FormGroup, requestURL: string): void {
    if (formgroup.valid) {
      // Fire formSubmitted event with the formGroup value
      this.formSubmitted.emit({ body: formgroup.getRawValue(), requestURL });
    }
  }
}


/**
 * @deprecated Will be removed in future versions
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appDynamicFormPage]'
})
// tslint:disable-next-line: directive-class-suffix
export class DynamicFormPageComponent extends BaseDynamicFormComponent {

  @HostBinding('class.content-container') class = true;
  /**
   * @description Component object instance initializer
   * @param builder [[FormBuilder]] Angular ReactiveForm FormBuilder
   * @param appUIStoreManager [[AppUIStoreManager]]
   */
  constructor(
    protected builder: FormBuilder,
    public appUIStoreManager: AppUIStoreManager
  ) {
    super(builder, appUIStoreManager);
  }
}


// Exporting classes and global funcs
export { ComponentReactiveFormHelpers } from '../components/dynamic-inputs/angular';
export { isGroupOfIDynamicForm } from '../components/dynamic-inputs/core';