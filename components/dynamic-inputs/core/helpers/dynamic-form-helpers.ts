import {
  IHTMLFormControl,
  IDynamicForm,
} from '../contracts';
import {
  DynamicForm
} from '../dynamic-form';
import { toDynamicControl } from '../input-types';
import { TranslationService } from '../../../../translator';
import { isArray, isDefined } from '../../../../utils';
import { DynamicFormInterface } from '../compact/types';

/**
 * @description Checks if a dynamic form contains other form
 * @param f [[IDynamicForm]]
 */
export function isGroupOfIDynamicForm(f: IDynamicForm): boolean {
  if (isDefined(f) && isDefined(f.forms)) {
    return true;
  }
  return false;
}

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


export class DynamicFormHelpers {
  /**
   * @description Create an instance of [[IDynamicForm]] from a [[Form]] instance
   * The method tries to translate prossible translatable label
   * @param form [[Form]]
   * @param translate [[TranslatorService]]
   */
  public static async buildDynamicForm(form: Partial<DynamicFormInterface>, translate: TranslationService): Promise<IDynamicForm> {
    const configGeneratorFn = async (f: Partial<DynamicFormInterface>, t: TranslationService) => {
      let configs: IHTMLFormControl[] = [];
      const translatables: string[] = [];
      let translations: any[];
      if (TranslationHelpers.shouldBetranslated(f.title)) {
        f.title = f.title ? `${TranslationHelpers.trimtranslatableValue(f.title)}` : null;
        f.description = f.description ? `${TranslationHelpers.trimtranslatableValue(f.description)}` : null;
        if (f.title) {
          translatables.push(f.title);
        }
        if (f.description) {
          translatables.push(f.description);
        }
      }
      if (isArray(f.formControls) && (f.formControls.length > 0)) {
        f.formControls.forEach((control) => {
          if (TranslationHelpers.shouldBetranslated(control.label)) {
            control.label = control.label ? `${TranslationHelpers.trimtranslatableValue(control.label)}` : null;
            if (control.label) {
              translatables.push(TranslationHelpers.trimtranslatableValue(control.label));
            }
          }
          if (TranslationHelpers.shouldBetranslated(control.description)) {
            control.description = control.description ? `${TranslationHelpers.trimtranslatableValue(control.description)}` : null;
            if (control.description) {
              translatables.push(TranslationHelpers.trimtranslatableValue(control.description));
            }
          }
          if (TranslationHelpers.shouldBetranslated(control.placeholder)) {
            control.placeholder = control.placeholder ? `${TranslationHelpers.trimtranslatableValue(control.placeholder)}` : null;
            if (control.placeholder) {
              translatables.push(TranslationHelpers.trimtranslatableValue(control.placeholder));
            }
          }
        });
      }
      if (translatables.length > 0) {
        translations = await t.translate(translatables).toPromise();
      }
      if (isArray(f.formControls) && (f.formControls.length > 0)) {
        configs = f.formControls.map((control) => {
          // Update the control label, description and placeholder values
          const config = toDynamicControl(control);
          // tslint:disable-next-line: max-line-length
          return Object.assign(config, {
            label: translations ? translations[control.label] : control.label,
            descriptionText: translations ? translations[control.description] : control.description,
            placeholder: translations ? translations[control.placeholder] : control.placeholder
          });
        });
      }
      let forms = null;
      if (f.children && f.children.length) {
        forms = await Promise.all(f.children.map(async (value) => {
          return await configGeneratorFn(value, translate);
        }));
      }
      return new DynamicForm({
        id: f.id,
        title: translations ? translations[f.title] : f.title,
        description: translations ? translations[f.description] : f.description,
        endpointURL: f.url,
        controlConfigs: configs,
        forms
      });

    };
    const buildedForm = await configGeneratorFn(form, translate);
    return buildedForm;
  }
}
