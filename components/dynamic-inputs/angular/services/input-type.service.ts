import { Injectable } from "@angular/core";
import { AbstractControl, FormArray } from "@angular/forms";
import {
  IHTMLFormControl,
  SelectInput,
  PasswordInput,
  CheckBoxInput,
  DateInput,
  TextInput,
  RadioInput,
  TextAreaInput,
  NumberInput,
  PhoneInput,
  FileInput,
  HMTLInput,
} from "../../core";

@Injectable({
  providedIn: "root",
})
export class DynamicInputTypeHelper {
  /**
   * @description Return an abstract control as a [[FormArray]]
   * @param control [[AbstractControl]]
   */
  public asFormArray(control?: AbstractControl): FormArray {
    return control as FormArray;
  }

  /**
   * @description Returns a dynamic input configuration as a [[SelectInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asSelectInput(input?: IHTMLFormControl): SelectInput {
    return input as SelectInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[DateInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asDateInput(input?: IHTMLFormControl): DateInput {
    return input as DateInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[CheckBoxInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asCheckBoxInput(input?: IHTMLFormControl): CheckBoxInput {
    return input as CheckBoxInput;
  }

  /**
   * @description Returns a dynamic input configuration as a [[RadioInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asRadioInput(input?: IHTMLFormControl): RadioInput {
    return input as RadioInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PasswordInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPasswordInput(input?: IHTMLFormControl): PasswordInput {
    return input as PasswordInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextInput(input?: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextAreaInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextAreaInput(input?: IHTMLFormControl): TextAreaInput {
    return input as TextAreaInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[NumberInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asNumberInput(input?: IHTMLFormControl): NumberInput {
    return input as NumberInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asEmailInput(input?: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[FileInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asFileInput(input?: IHTMLFormControl): FileInput {
    return input as FileInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[HTMLInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asHtmlInput(input?: IHTMLFormControl): HMTLInput {
    return input as HMTLInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PhoneInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPhoneInput(input?: IHTMLFormControl): PhoneInput {
    return input as PhoneInput;
  }
}
