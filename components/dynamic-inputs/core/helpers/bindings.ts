import { getObjectProperty } from '../../../../utils';
import {
  BindingControlInterface,
  InputTypes,
  SelectSourceInterface,
} from '../types';

export const setControlOptions = <
  T extends BindingControlInterface = BindingControlInterface
>(
  control: Partial<T>,
  values: { [prop: string]: any }[]
) => {
  let result: any[] = [];
  if (control.clientBindings) {
    const items = control.clientBindings?.split('|') || [];
    switch (control.type) {
      case InputTypes.CHECKBOX_INPUT:
        result = checkboxInputItems(items);
        break;
      case InputTypes.RADIO_INPUT:
        result = radioInputOptions(items);
        break;
      case InputTypes.SELECT_INPUT:
        result = selectInputOptions(items);
        break;
    }
  } else if (control.serverBindings) {
    result = values
      ? values.map((v) => {
          return {
            value: getObjectProperty(v, control.keyfield || ''),
            description: getObjectProperty(v, control.valuefield || ''),
            name: getObjectProperty(v, control.valuefield || ''),
            type:
              control.groupfield &&
              control.keyfield !== control.groupfield &&
              control.valuefield !== control.groupfield
                ? v[control.groupfield]
                : null,
          } as SelectSourceInterface;
        })
      : [];
  }
  return { ...control, items: result } as T;
};

function checkboxInputItems(items: string[]) {
  return items?.map((current, index) => {
    if (current.indexOf(':') !== -1) {
      const idValueFields = current.split(':');
      return {
        value: idValueFields[0].trim(),
        checked: index === 0,
        description: idValueFields[1].trim(),
      };
    } else {
      return {
        value: isNaN(+current.trim()) ? current.trim() : +current.trim(),
        checked: index === 0,
        description: current.trim(),
      };
    }
  });
}

function radioInputOptions(items: string[]) {
  return items.map((current, index) => {
    if (current.indexOf(':') !== -1) {
      const idValueFields = current.split(':');
      return {
        value: idValueFields[0].trim(),
        checked: index === 0,
        description: idValueFields[1].trim(),
      };
    } else {
      return {
        value: isNaN(+current.trim()) ? current.trim() : +current.trim(),
        checked: index === 0,
        description: current.trim(),
      };
    }
  });
}

function selectInputOptions(items: string[]) {
  return items.map((current: string, index) => {
    if (current.indexOf(':') !== -1) {
      const idValueFields = current.split(':');
      return {
        value: idValueFields[0].trim(),
        name: idValueFields[1].trim(),
        description: idValueFields[1].trim(),
      } as SelectSourceInterface;
    } else {
      return {
        value: isNaN(+current.trim()) ? current.trim() : +current.trim(),
        name: current.trim(),
        description: current.trim(),
      } as SelectSourceInterface;
    }
  });
}
