import { ControlInterface } from "../compact/types";
import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { InputTypes } from "../contracts/input-types";
import { CheckBoxInput } from "../types/checkbox";
import { DateInput } from "../types/date";
import { DynamicForm } from "../types/dynamic-form";
import { FileInput } from "../types/file";
import { HMTLInput } from "../types/header";
import { HiddenInput } from "../types/hidden";
import { NumberInput } from "../types/number";
import { PasswordInput } from "../types/password";
import { PhoneInput } from "../types/phone";
import { RadioInput } from "../types/radio";
import { SelectInput } from "../types/select";
import { TextInput } from "../types/text";
import { TextAreaInput } from "../types/textarea";
import { sortformbyindex } from "./form";

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

export function toDynamicControl(
  model: Partial<ControlInterface>
): IHTMLFormControl {
  switch (model.type) {
    case InputTypes.DATE_INPUT:
      return DateInput.fromFormControlModel(model);
    case InputTypes.SELECT_INPUT:
      return SelectInput.fromFormControlModel(model);
    case InputTypes.TEXTAREA_INPUT:
      return TextAreaInput.fromFormControlModel(model);
    case InputTypes.NUMBER_INPUT:
      return NumberInput.fromFormControlModel(model);
    case InputTypes.PHONE_INPUT:
      return PhoneInput.fromFormControlModel(model);
    case InputTypes.PASSWORD_INPUT:
      return PasswordInput.fromFormControlModel(model);
    case InputTypes.CHECKBOX_INPUT:
      return CheckBoxInput.fromFormControlModel(model);
    case InputTypes.RADIO_INPUT:
      return RadioInput.fromFormControlModel(model);
    case InputTypes.EMAIL_INPUT:
      return TextInput.fromFormControlModel(model);
    case InputTypes.HIDDEN_INPUT:
      return HiddenInput.fromFormControlModel(model);
    case InputTypes.FILE_INPUT:
      return FileInput.fromFormControlModel(model);
    case InputTypes.HTML_INPUT:
      return HMTLInput.fromFormControlModel(model);
    default:
      return TextInput.fromFormControlModel(model);
  }
}
