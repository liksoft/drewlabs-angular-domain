import { ApplyAttributeChangesToControlsFn, IConditionalControlBinding } from './types';
import { isDefined } from '../../../../utils/types/type-utils';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { IDynamicForm } from '../../core/contracts/dynamic-form';
import { includes, toNumber, isNumber } from 'lodash';
import { ComponentReactiveFormHelpers, isGroupOfIDynamicForm } from '../../../../helpers/component-reactive-form-helpers';
import { AbstractControl } from '@angular/forms';

export const applyHiddenAttributeToControlFn = (
  form: IDynamicForm,
  bidings: IConditionalControlBinding,
  value: string | number) => (
  (formgroup: AbstractControl) => {
    if (isDefined(form.controlConfigs) && ((form.controlConfigs as Array<IHTMLFormControl>).length > 0)) {
      form.controlConfigs = (form.controlConfigs as Array<IHTMLFormControl>).map((c) => {
        if (c.formControlName === bidings.key) {
          value = isNaN(value as any) ? value : toNumber(value);
          const requiredIfValues = isNumber(value) ? c.requiredIf.values.map(item => {
            return isNaN(item) ? item : toNumber(item);
          }) : c.requiredIf.values;
          c.hidden = !includes(requiredIfValues, value) ? true : false;
          if (c.hidden) {
            formgroup.get(bidings.key).setValue(null);
            ComponentReactiveFormHelpers.clearControlValidators(formgroup.get(bidings.key));
            ComponentReactiveFormHelpers.clearAsyncValidators(formgroup.get(bidings.key));
          } else {
            formgroup.get(bidings.key).setValidators(bidings.validators);
            formgroup.get(bidings.key).setAsyncValidators(bidings.asyncValidators);
          }
        }
        return c;
      });
    }
    return { control: formgroup, form };
  }
);



// tslint:disable-next-line: typedef
export const bindingsFromDynamicForm = (form: IDynamicForm) => (
  (formgroup: AbstractControl) => {
    const bindings = {} as { [index: string]: IConditionalControlBinding };
    if (isDefined(form.controlConfigs)
      && isDefined(formgroup)
      && ((form.controlConfigs as Array<IHTMLFormControl>).length > 0)) {
      (form.controlConfigs as IHTMLFormControl[]).forEach((c) => {
        if (isDefined(c.requiredIf)) {
          bindings[c.formControlName] = {
            key: c.formControlName,
            binding: c.requiredIf,
            validators: formgroup.get(c.formControlName).validator,
            asyncValidators: formgroup.get(c.formControlName).asyncValidator,
          };
        }
      });
      for (const [_, value] of Object.entries(bindings)) {
        if (isDefined(formgroup.get(value.binding.formControlName))) {
          const { control, dynamicForm } = applyHiddenAttributeChangeToControl(
            form,
            value,
            formgroup.get(value.binding.formControlName).value,
            applyHiddenAttributeToControlFn
          )(formgroup);
          formgroup = control;
          form = dynamicForm;
        }
      }
    }
    return { bindings, formgroup, form };
  }
);

// tslint:disable-next-line: typedef
export const applyHiddenAttributeChangeToControl = (
  param: IDynamicForm,
  bindings: IConditionalControlBinding,
  value: string | number,
  fn: ApplyAttributeChangesToControlsFn) => (
  (formgroup: AbstractControl) => {
    if (isGroupOfIDynamicForm(param)) {
      param.forms = param.forms.map((v) => {
        // Call the update method here
        const { control, form } = fn(v, bindings, value)(formgroup);
        formgroup = control;
        return form;
      });
    } else {
      // Calls the update method here
      const { control, form } = fn(param, bindings, value)(formgroup);
      formgroup = control;
      param = form;
    }
    return { control: formgroup, dynamicForm: param };
  }
);
