import { cloneDeep } from "lodash";
import { Order } from "../../../../utils/enums";
import { ArrayUtils, isArray, isDefined } from "../../../../utils/types";
import {
  DynamicFormControlInterface,
  DynamicFormInterface,
} from "../compact/types";
import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { DynamicForm } from "../dynamic-form";
import { toDynamicControl } from "../input-types";

/**
 * @description Sort a dynamic form control configs by their [[formControlIndex]] property in the ascending order
 * @deprecated Use {sortDynamicFormByIndex} instead
 * @param form [[IDynamicForm]]
 */
export const sortFormByIndex = (form: IDynamicForm) => {
  const loopThroughFormsFn = (f: IDynamicForm) => {
    if (isArray(f.forms) && !(f?.forms?.length === 0)) {
      f.forms?.forEach((i) => {
        loopThroughFormsFn(i);
      });
    }
    if (
      isArray(f.controlConfigs) &&
      (f.controlConfigs as Array<IHTMLFormControl>).length > 0
    ) {
      f.controlConfigs = ArrayUtils.sort(
        f.controlConfigs as Array<IHTMLFormControl>,
        "formControlIndex",
        1
      ) as IHTMLFormControl[];
    }
    return f;
  };
  return loopThroughFormsFn(form);
};

/**
 * @description Sort a dynamic form control configs by their index
 * @param form
 */
export const sortDynamicFormByIndex = (form: IDynamicForm) => {
  const loopThroughFormsFn = (
    f: IDynamicForm,
    sortingOrder: Order = Order.ASC
  ) => {
    if (isArray(f.forms) && !(f?.forms?.length === 0)) {
      f.forms?.forEach((i) => {
        loopThroughFormsFn(i);
      });
    }
    if (
      isArray(f.controlConfigs) &&
      (f.controlConfigs as Array<IHTMLFormControl>).length > 0
    ) {
      f.controlConfigs = ArrayUtils.sort(
        f.controlConfigs as Array<IHTMLFormControl>,
        "formControlIndex",
        sortingOrder
      ) as IHTMLFormControl[];
    }
    return f;
  };
  return loopThroughFormsFn(form);
};

/**
 * @description Creates a deep copy of the dynamic form object
 * @param form
 */
export const cloneDynamicForm = (form: IDynamicForm) =>
  cloneDeep(form) as IDynamicForm;

/**
 * @description Helper method for creating a new dynmaic form
 * @param form Object with the shape of the IDynamicForm interface
 */
export const createDynamicForm = (form: IDynamicForm) => {
  return sortDynamicFormByIndex(new DynamicForm(cloneDynamicForm(form)));
};

/**
 * @description Sort form loaded from backend server by control index
 * @param f
 */
export const sortFormFormControlsByIndex = (value: DynamicFormInterface) => {
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
  return value;
};

export class DynamicFormHelpers {
  /**
   * @description Create an instance of IDynamic interface
   *
   * @param form
   */
  static buildDynamicForm: (
    form: DynamicFormInterface
  ) => Promise<IDynamicForm | undefined> = (form: DynamicFormInterface) => {
    return new Promise((resolve, _) => {
      const generatorFn: (f: DynamicFormInterface) => IDynamicForm | undefined =
        (f: DynamicFormInterface) => {
          let configs: IHTMLFormControl[] | undefined = [];
          if (isArray(f?.formControls) && f?.formControls?.length > 0) {
            configs = f.formControls
              ?.map((control) => {
                const config = toDynamicControl(control);
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
      resolve(generatorFn(form));
    });
  };
}
