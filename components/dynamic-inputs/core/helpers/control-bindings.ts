import { getObjectProperty } from "../../../../utils/types";
import { ISelectItem } from "../contracts/control-item";
import { BindingControlInterface } from "../contracts/dynamic-input";

export const controlBindingsSetter = <T extends BindingControlInterface>(
  values: { [prop: string]: any }[]
) => {
  return (control: Partial<T>) => {
    let result: any[] = [];
    if (control.clientBindings) {
      const items = control.clientBindings?.split("|") || [];
      result = [
        ...items.map((v, i) => {
          if (v.indexOf(":") !== -1) {
            const idValueFields = v.split(":");
            return {
              value: idValueFields[0].trim(),
              name: idValueFields[1].trim(),
              description: idValueFields[1].trim(),
            } as ISelectItem;
          } else {
            return {
              value: isNaN(+v.trim()) ? v.trim() : +v.trim(),
              name: v.trim(),
              description: v.trim(),
            } as ISelectItem;
          }
        }),
      ];
    } else if (control.serverBindings) {
      result = [
        ...(values
          ? values.map((v) => {
              return {
                value: getObjectProperty(v, control.keyfield || ""),
                description: getObjectProperty(v, control.valuefield || ""),
                name: getObjectProperty(v, control.valuefield || ""),
                type:
                  control.groupfield &&
                  control.keyfield !== control.groupfield &&
                  control.valuefield !== control.groupfield
                    ? v[control.groupfield]
                    : null,
              } as ISelectItem;
            })
          : []),
      ];
    }
    return { ...control, items: result } as T;
  };
};
