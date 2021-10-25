import { ArrayUtils } from "../../../../utils/types";
import { ControlInterface, FormInterface } from "../compact/types";
import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { DynamicForm } from "../types/dynamic-form";
import { cloneDeep } from "lodash";
import { buildControl } from "../types/builder";

export class DynamicFormHelpers {
  /**
   * @description Create an instance of IDynamic interface
   * @deprecated
   * @param form
   */
  static buildDynamicForm = (form: FormInterface) => {
    return new Promise<IDynamicForm | undefined>((resolve, _) => {
      resolve(DynamicFormHelpers.buildFormSync(form));
    });
  };

  /**
   * @description Create an instance of IDynamic interface
   *
   * @param form
   */
  static buildFormSync(form: FormInterface) {
    const generatorFn = function (instance: FormInterface) {
      const hasControls =
        Array.isArray(instance?.controls) && instance?.controls?.length !== 0;
      return form
        ? createform({
            id: instance.id,
            title: instance.title,
            description: instance.description,
            endpointURL: instance.url,
            controlConfigs: hasControls
              ? instance.controls
                  ?.map((control) => {
                    const config = buildControl(control);
                    // tslint:disable-next-line: max-line-length
                    return { ...config } as IHTMLFormControl;
                  })
                  .filter((value) => value ?? false)
              : [],
          })
        : undefined;
    };
    return generatorFn(form);
  }
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
export const createform = (form: IDynamicForm) =>
  new DynamicForm(form) as IDynamicForm;

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
  const loopThroughFormsFn = (form_: IDynamicForm, order = 1) => {
    const hasControls =
      Array.isArray(form_.controlConfigs) &&
      (form_.controlConfigs as Array<IHTMLFormControl>).length !== 0;
    if (hasControls) {
      form_.controlConfigs = ArrayUtils.sort(
        form_.controlConfigs as Array<IHTMLFormControl>,
        "formControlIndex",
        order
      ) as IHTMLFormControl[];
    }
    return form_;
  };
  return loopThroughFormsFn(form);
};

/**
 * @description Sort form loaded from backend server by control index
 */
export const sortRawFormControls = (value: FormInterface) => {
  if (
    Array.isArray(value.controls) &&
    (value.controls as ControlInterface[]).length !== 0
  ) {
    value.controls = ArrayUtils.sort(
      value.controls as ControlInterface[],
      "controlIndex",
      1
    ) as ControlInterface[];
  }
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
