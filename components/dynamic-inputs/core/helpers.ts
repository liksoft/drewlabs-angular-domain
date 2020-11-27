import { IHTMLFormControl, HTMLFormControlRequireIfConfig } from './contracts/dynamic-input';
import { IDynamicForm } from './contracts/dynamic-form';
import { isArray, isDefined } from '../../../utils/types/type-utils';
import { ArrayUtils } from '../../../utils/types/array-utils';
import { CheckboxItem, ISelectItem, RadioItem } from './contracts/control-item';
import { DynamicForm } from './dynamic-form';
import { DynamicFormControlInterface } from './compact/types';

/**
 * @description Sort a dynamic form control configs by their [[formControlIndex]] property in the ascending order
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

export function rebuildFormControlConfigs(form: IDynamicForm, controlConfigs: Array<IHTMLFormControl>): IDynamicForm {
  return sortFormByIndex(
    new DynamicForm({
      id: form.id,
      title: form.title,
      endpointURL: form.endpointURL,
      description: form.description,
      controlConfigs,
      forms: form.forms
    })
  );
}

/**
 * @description Helper method for creating a new dynmaic form
 * @param formConfigs Object with the shape of the IDynamicForm interface
 */
export function createDynamicForm(formConfigs: IDynamicForm): IDynamicForm {
  return new DynamicForm(formConfigs);
}

function parseControlItemsConfigs(model: DynamicFormControlInterface): { keyfield: string, valuefield: string, groupfield: string } {
  const items = model.selectableModel.split('|');
  const keyfield = items[2].replace('keyfield:', '');
  const groupfield = items[3].replace('groupfield:', '');
  const valuefield = items[4].replace('valuefield:', '');
  return { keyfield, valuefield, groupfield };
}



export function buildRequiredIfConfig(stringifiedConfig: string): HTMLFormControlRequireIfConfig {
  if (!isDefined(stringifiedConfig) || (stringifiedConfig.indexOf(':') === -1)) { return null; }
  // split the string into the two parts
  const parts = stringifiedConfig.split(':');
  return {
    formControlName: parts[0].trim(),
    values: parts[1].indexOf(',') !== -1 ? parts[1].split(',') : [parts[1]]
  };
}

export function buildCheckboxItems(model: DynamicFormControlInterface): CheckboxItem[] {
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

export function buildSelectItems(model: DynamicFormControlInterface): ISelectItem[] {
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

export function buildRadioInputItems(model: DynamicFormControlInterface): RadioItem[] {
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
