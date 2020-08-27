import { IHTMLFormControl } from '../core/contracts/dynamic-input';
import { Injectable } from '@angular/core';
import { InputTypes } from '../core/contracts/input-types';
// tslint:disable-next-line: max-line-length
import { CheckBoxInput, DateInput, SelectInput, TextAreaInput, NumberInput, TextInput, PhoneInput, PasswordInput, RadioInput } from '../core';

@Injectable({
  providedIn: 'root'
})
export class HTMLFormControlService {

  /**
   * @description Generate an [[IHTMLFormControl]] based on the provided input type
   * @param inputType Input type parameter
   * @param value Configuration object for the input to build
   * @return [[IHTMLFormControl]]
   */
  buildInput(inputType: string, value: IHTMLFormControl): IHTMLFormControl {
    switch (inputType.toLocaleLowerCase()) {
      case InputTypes.CHECKBOX_INPUT:
        return new CheckBoxInput(value as CheckBoxInput);
      case InputTypes.DATE_INPUT:
        return new DateInput(value as DateInput);
      case InputTypes.SELECT_INPUT:
        return new SelectInput(value as SelectInput);
      case InputTypes.TEXTAREA_INPUT:
        return new TextAreaInput(value as TextAreaInput);
      case InputTypes.NUMBER_INPUT:
        return new NumberInput(value as NumberInput);
      case InputTypes.TEXT_INPUT:
        return new TextInput(value as TextInput);
      case InputTypes.PHONE_INPUT:
        return new PhoneInput(value as PhoneInput);
      case InputTypes.PASSWORD_INPUT:
        return new PasswordInput(value as PasswordInput);
      case InputTypes.RADIO_INPUT:
        return new RadioInput(value);
      default:
        throw new Error(
          'Error building input, invalide input type. Check InputTypes Enum class for possible inputs.'
        );
    }
  }
}
