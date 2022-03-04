import { IHTMLFormControl, HTMLFormControlRequireIfConfig, BindingControlInterface } from './contracts/dynamic-input';
import { IDynamicForm } from './contracts/dynamic-form';
import { isArray, isDefined } from '../../../utils/types/type-utils';
import { ArrayUtils } from '../../../utils/types/array-utils';
import { CheckboxItem, ISelectItem, RadioItem } from './contracts/control-item';
import { DynamicForm } from './dynamic-form';
import { DynamicFormControlInterface, DynamicFormInterface } from './compact/types';
import { Order } from '../../../utils/enums';
import { cloneDeep } from 'lodash';

/**
 * @description Sort form loaded from backend server by control index
 * @param f [[Form]]
 */
export function sortFormFormControlsByIndex(value: DynamicFormInterface): DynamicFormInterface {
  if (isArray(value.formControls) && (value.formControls as DynamicFormControlInterface[]).length > 0) {
    value.formControls = ArrayUtils.sort((value.formControls as DynamicFormControlInterface[]), 'controlIndex', 1) as DynamicFormControlInterface[];
  }
  return value;
}

/**
 * @description Sort a dynamic form control configs by their [[formControlIndex]] property in the ascending order
 * @deprecated Use {sortDynamicFormByIndex} instead
 * @param form [[IDynamicForm]]
 */
export function sortFormByIndex(form: IDynamicForm): IDynamicForm {
  const loopThroughFormsFn = (f: IDynamicForm) => {
    if (isArray(f.forms) && f.forms.length > 0) {
      f.forms.forEach((i) => {
        loopThroughFormsFn(i);
      });
    }
    if (isArray(f.controlConfigs) && (f.controlConfigs as Array<IHTMLFormControl>).length > 0) {
      f.controlConfigs = ArrayUtils.sort((f.controlConfigs as Array<IHTMLFormControl>), 'formControlIndex', 1) as IHTMLFormControl[];
    }
    return f;
  };
  return loopThroughFormsFn(form);
}

/**
 * @description Sort a dynamic form control configs by their [[formControlIndex]]
 * property in the user specified order. Note: By default controls are sorted in the
 * ascending order
 * @param form [[IDynamicForm]]
 */
export function sortDynamicFormByIndex(form: IDynamicForm): IDynamicForm {
  const loopThroughFormsFn = (f: IDynamicForm, sortingOrder: Order = Order.ASC) => {
    if (isArray(f.forms) && f.forms.length > 0) {
      f.forms.forEach((i) => {
        loopThroughFormsFn(i);
      });
    }
    if (isArray(f.controlConfigs) && (f.controlConfigs as Array<IHTMLFormControl>).length > 0) {
      f.controlConfigs = ArrayUtils.sort((f.controlConfigs as Array<IHTMLFormControl>), 'formControlIndex', sortingOrder) as IHTMLFormControl[];
    }
    return f;
  };
  return loopThroughFormsFn(form);
}


export function rebuildFormControlConfigs(form: IDynamicForm, controlConfigs: Array<IHTMLFormControl>): IDynamicForm {
  return sortDynamicFormByIndex(
    new DynamicForm({
      id: form.id,
      title: form.title,
      endpointURL: form.endpointURL,
      description: form.description,
      controlConfigs: [...controlConfigs],
      forms: form.forms
    })
  );
}

/**
 * @description Helper method for creating a new dynmaic form
 * @param form Object with the shape of the IDynamicForm interface
 */
export function createDynamicForm(form: IDynamicForm): IDynamicForm {
  return sortDynamicFormByIndex(new DynamicForm(cloneDynamicForm(form)));
}

/**
 * @description Creates a deep copy of the dynamic form object
 * @param form [IDynamic form]
 * @returns [IDynamicForm]
 */
export const cloneDynamicForm = (form: IDynamicForm) => cloneDeep(form) as IDynamicForm;

export function parseControlItemsConfigs(
  model: Partial<DynamicFormControlInterface>
): { keyfield: string, valuefield: string, groupfield: string } {
  const items = model.selectableModel.split('|');
  let keyfield: string;
  let groupfield: string;
  let valuefield: string;
  items.forEach(key => {
    if (key.match(/keyfield:/)) {
      keyfield = key.replace('keyfield:', '');
    }
    if (key.match(/groupfield:/)) {
      groupfield = key.replace('groupfield:', '');
    }
    if (key.match(/valuefield:/)) {
      valuefield = key.replace('valuefield:', '');
    }
  });
  return { keyfield, valuefield, groupfield };
}



export function buildRequiredIfConfig(stringifiedConfig: string): HTMLFormControlRequireIfConfig {
  if (!isDefined(stringifiedConfig) || (stringifiedConfig.indexOf(':') === -1)) { return null; }
  // split the string into the two parts
  const parts = stringifiedConfig.split(':');
  let values = [];
  // Split by '|' Character
  const result = parts[1].indexOf('|') !== -1 ? parts[1].split('|') : [parts[1]];
  // Split by ',' character
  // @deprecated
  result.forEach((part) => {
    const split = part.indexOf(',') !== -1 ? part.split(',') : part;
    values = [...values, ...split];
  });
  return {
    formControlName: parts[0].trim(),
    values
  };
}

export function buildCheckboxItems(model: Partial<DynamicFormControlInterface>): CheckboxItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          value: idValueFields[0].trim(),
          checked: i === 0,
          description: idValueFields[1].trim()
        };
      } else {
        return {
          value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          checked: i === 0,
          description: v.trim()
        };
      }
    });
  } else if (isDefined(model.selectableModel)) {
    let { keyfield, valuefield, groupfield } = parseControlItemsConfigs(model);
    keyfield = model.keyfield || keyfield;
    valuefield = model.valuefield || valuefield;
    groupfield = model.groupfield;
    return model.options ? model.options.map((v, index) => {
      return {
        value: v[keyfield],
        checked: index === 0,
        description: v[valuefield]
      } as CheckboxItem;
    }) : [];
  } else {
    return [];
  }
}

/**
 * @deprecated
 */
export function buildSelectItems(model: Partial<DynamicFormControlInterface>): ISelectItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          value: idValueFields[0].trim(),
          name: idValueFields[1].trim(),
          description: idValueFields[1].trim()
        } as ISelectItem;
      } else {
        return {
          value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          name: v.trim(),
          description: v.trim()
        } as ISelectItem;
      }
    });

  } else if (isDefined(model.selectableModel)) {
    let { keyfield, valuefield, groupfield } = parseControlItemsConfigs(model);
    keyfield = model.keyfield || keyfield;
    valuefield = model.valuefield || valuefield;
    groupfield = model.groupfield;
    return model.options ? model.options.map((v) => {
      return {
        value: v[keyfield],
        description: v[valuefield],
        name: v[valuefield],
        type: groupfield && (keyfield !== groupfield) && (valuefield !== groupfield) ? v[groupfield] : null
      } as ISelectItem;
    }) : [];
  } else {
    return [];
  }
}

export const controlBindingsSetter = <T extends BindingControlInterface>(values: { [prop: string]: any }[]) => {
  return (control: Partial<T>) => {
    let result = [];
    if (isDefined(control.clientBindings)) {
      const items = control.clientBindings.split('|');
      result = [
        ...(items.map((v, i) => {
          if (v.indexOf(':') !== -1) {
            const idValueFields = v.split(':');
            return {
              value: idValueFields[0].trim(),
              name: idValueFields[1].trim(),
              description: idValueFields[1].trim()
            } as ISelectItem;
          } else {
            return {
              value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
              name: v.trim(),
              description: v.trim()
            } as ISelectItem;
          }
        }))
      ];
    } else if (isDefined(control.serverBindings)) {
      result = [
        ...(
          values ? values.map((v) => {
            return {
              value: v[control.keyfield],
              description: v[control.valuefield],
              name: v[control.valuefield],
              type: control.groupfield &&
                (control.keyfield !== control.groupfield) && (control.valuefield !== control.groupfield) ?
                v[control.groupfield] : null
            } as ISelectItem;
          }) : []
        )
      ];
    }
    return { ...control, items: result } as Partial<T>;
  };
};


export function buildRadioInputItems(model: Partial<DynamicFormControlInterface>): RadioItem[] {
  if (isDefined(model.selectableValues)) {
    const items = model.selectableValues.split('|');
    return items.map((v, i) => {
      if (v.indexOf(':') !== -1) {
        const idValueFields = v.split(':');
        return {
          value: idValueFields[0].trim(),
          checked: i === 0,
          description: idValueFields[1].trim()
        };
      } else {
        return {
          value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
          checked: i === 0,
          description: v.trim()
        };
      }
    });

  } else if (isDefined(model.selectableModel)) {
    let { keyfield, valuefield, groupfield } = parseControlItemsConfigs(model);
    keyfield = model.keyfield || keyfield;
    valuefield = model.valuefield || valuefield;
    groupfield = model.groupfield;
    return model.options ? model.options.map((v, index) => {
      return {
        value: v[keyfield],
        checked: index === 0,
        description: v[valuefield]
      } as RadioItem;
    }) : [];
  } else {
    return [];
  }
}

/**
 * @description Checks if a dynamic form contains other form
 * @param f [[IDynamicForm]]
 */
 export const isGroupOfIDynamicForm = (value: IDynamicForm) => isDefined(value) && isArray(value.forms) ? true : false;