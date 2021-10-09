import { IHTMLFormControl } from "../../core/contracts/dynamic-input";
import { IDynamicForm } from "../../core/contracts/dynamic-form";
import { includes, toNumber, isNumber } from "lodash";
import { AbstractControl } from "@angular/forms";
import {
  ApplyAttributeChangesToControlsFn,
  BindingInterface,
  ControlBindings,
} from "../types";
import { ComponentReactiveFormHelpers } from "./reactive-form-helpers";

export const applyHiddenAttributeCallback =
  (form: IDynamicForm, bidings: BindingInterface, value: string | number) =>
  (formgroup: AbstractControl) => {
    if (
      Array.isArray(form.controlConfigs) &&
      form.controlConfigs.length !== 0
    ) {
      form.controlConfigs = (
        form.controlConfigs as Array<IHTMLFormControl>
      ).map((_control) => {
        if (_control.formControlName === bidings.key) {
          value = isNaN(value as any) ? value : toNumber(value);
          const requiredIfValues = isNumber(value)
            ? _control.requiredIf
              ? _control.requiredIf.values.map((item) => {
                  return isNaN(item) ? item : toNumber(item);
                })
              : []
            : _control.requiredIf?.values || [];
          _control.hidden = !includes(requiredIfValues, value) ? true : false;
          if (_control.hidden) {
            formgroup.get(bidings.key)?.setValue(null);
            ComponentReactiveFormHelpers.clearControlValidators(
              formgroup.get(bidings.key) || undefined
            );
            ComponentReactiveFormHelpers.clearAsyncValidators(
              formgroup.get(bidings.key) || undefined
            );
          } else {
            formgroup
              .get(bidings.key)
              ?.setValidators(bidings.validators || null);
            formgroup
              .get(bidings.key)
              ?.setAsyncValidators(bidings.asyncValidators || null);
          }
        }
        return _control;
      });
    }
    return { control: formgroup, form };
  };

// tslint:disable-next-line: typedef
export const getControlBinding =
  (form: IDynamicForm) => (formgroup: AbstractControl) => {
    const bindings = {} as ControlBindings;
    if (
      Array.isArray(form.controlConfigs) &&
      form.controlConfigs.length !== 0 &&
      formgroup
    ) {
      (form.controlConfigs as IHTMLFormControl[]).forEach((c) => {
        if (c.requiredIf) {
          bindings[c.formControlName] = {
            key: c.formControlName,
            binding: c.requiredIf,
            validators:
              formgroup.get(c.formControlName)?.validator || undefined,
            asyncValidators:
              formgroup.get(c.formControlName)?.asyncValidator || undefined,
          };
        }
      });
      for (const [_, value] of Object.entries(bindings)) {
        const binding = value.binding || undefined;
        if (
          binding &&
          false !== (formgroup.get(binding?.formControlName) || false)
        ) {
          const { control, dynamicForm } = applyAttribute(
            form,
            value,
            value.binding
              ? formgroup.get(value.binding?.formControlName)?.value
              : undefined,
            applyHiddenAttributeCallback
          )(formgroup);
          formgroup = control;
          form = dynamicForm;
        }
      }
    }
    return { bindings, formgroup, form };
  };

// tslint:disable-next-line: typedef
export const applyAttribute =
  (
    param: IDynamicForm,
    bindings: BindingInterface,
    value: string | number,
    fn: ApplyAttributeChangesToControlsFn
  ) =>
  (formgroup: AbstractControl) => {
    // Calls the update method here
    const { control, form } = fn(param, bindings, value)(formgroup);
    formgroup = control;
    param = form;
    return { control: formgroup, dynamicForm: param };
  };
