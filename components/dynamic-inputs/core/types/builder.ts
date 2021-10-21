import { ControlInterface } from "../compact/types";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { InputTypes } from "../contracts/input-types";
import { CheckBoxInput } from "./checkbox";
import { DateInput } from "./date";
import { FileInput } from "./file";
import { HMTLInput } from "./header";
import { HiddenInput } from "./hidden";
import { NumberInput } from "./number";
import { PasswordInput } from "./password";
import { PhoneInput } from "./phone";
import { RadioInput } from "./radio";
import { SelectInput } from "./select";
import { TextInput } from "./text";
import { TextAreaInput } from "./textarea";

export function buildControl(
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
