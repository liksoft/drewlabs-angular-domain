import { Order } from "../../../../utils/enums";
import { ArrayUtils, isArray, isDefined } from "../../../../utils/types";
import {
  DynamicFormControlInterface,
  DynamicFormInterface,
} from "../compact/types";
import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { DynamicForm } from "../types/dynamic-form";
import { cloneDeep } from "lodash";
import { buildControl } from "../types/builder";
import { Log } from "src/app/lib/core/utils/logger";

export class DynamicFormHelpers {
  /**
   * @description Create an instance of IDynamic interface
   *
   * @param form
   */
  static buildDynamicForm = (form: DynamicFormInterface) => {
    return new Promise<IDynamicForm | undefined>((resolve, _) => {
      resolve(DynamicFormHelpers.buildFormSync(form));
    });
  };

  /**
   * @description Create an instance of IDynamic interface
   *
   * @param form
   */
  static buildFormSync = (form: DynamicFormInterface) => {
    const generatorFn: (f: DynamicFormInterface) => IDynamicForm | undefined = (
      f: DynamicFormInterface
    ) => {
      let configs: IHTMLFormControl[] | undefined = [];
      if (isArray(f?.formControls) && f?.formControls?.length > 0) {
        configs = f.formControls
          ?.map((control) => {
            const config = buildControl(control);
            // tslint:disable-next-line: max-line-length
            return { ...config } as IHTMLFormControl;
          })
          .filter((value) => isDefined(value));
      }
      let forms: any[] | undefined =
        f?.children && f?.children?.length > 0
          ? f.children.map((value) => generatorFn(value))
          : undefined;
      if (form) {
        return new DynamicForm({
          id: f.id,
          title: f.title,
          description: f.description,
          endpointURL: f.url,
          controlConfigs: configs,
          forms,
        });
      }
      return undefined;
    };
    return generatorFn(form);
  };
}

// # Forms Creators

/**
 * @description Creates a deep copy of the dynamic form object
 * @param form
 */
export const cloneform = (form: IDynamicForm) =>
  cloneDeep(form) as IDynamicForm;

/**
 * @description Helper method for creating a new dynmaic form
 * @param form Object with the shape of the IDynamicForm interface
 */
export const createform = (form: IDynamicForm) => new DynamicForm(form);

/**
 * Create a new dynamic form from a copy of the user provided parameter
 *
 * @param form
 * @returns
 */
export const copyform = (form: IDynamicForm) => createform(cloneDeep(form));

// #Forms Soring function

/**
 * @description Sort a dynamic form control configs by their index
 * @param form
 */
export const sortformbyindex = (form: IDynamicForm) => {
  const loopThroughFormsFn = (
    form_: IDynamicForm,
    sortingOrder: Order = Order.ASC
  ) => {
    const hasControls =
      isArray(form_.controlConfigs) &&
      (form_.controlConfigs as Array<IHTMLFormControl>).length > 0;
    if (hasControls) {
      form_.controlConfigs = ArrayUtils.sort(
        form_.controlConfigs as Array<IHTMLFormControl>,
        "formControlIndex",
        sortingOrder
      ) as IHTMLFormControl[];
    }
    return form_;
  };
  return loopThroughFormsFn(form);
};

/**
 * @description Sort form loaded from backend server by control index
 * @param f
 */
export const sortRawFormControls = (value: DynamicFormInterface) => {
  Log('Value before sorting:', value);
  if (
    isArray(value.formControls) &&
    (value.formControls as DynamicFormControlInterface[]).length > 0
  ) {
    value.formControls = ArrayUtils.sort(
      value.formControls as DynamicFormControlInterface[],
      "controlIndex",
      1
    ) as DynamicFormControlInterface[];
  }
  Log('After before sorting:', value);
  return value;
};

// # Form control builder
export const rebuildFormControlConfigs = (
  form: IDynamicForm,
  controlConfigs: Array<IHTMLFormControl>
) => {
  return sortformbyindex(
    new DynamicForm({
      id: form.id,
      title: form.title,
      endpointURL: form.endpointURL,
      description: form.description,
      controlConfigs: [...controlConfigs],
      forms: form.forms,
    })
  );
};
