import { ArrayUtils } from 'src/app/lib/domain/utils/array-utils';
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
  InputTypes,
  RadioItem,
  CheckboxItem,
  ISelectItem
} from 'src/app/lib/domain/components/dynamic-inputs/core';
import { FormGroup, FormBuilder, NgModel, FormControl } from '@angular/forms';
import { AbstractControl, FormArray } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MomentUtils } from 'src/app/lib/domain/utils/moment-utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.css']
})
export class DynamicFormControlComponent implements OnInit, OnDestroy {
  // Formcontrol injected from the parent controller
  @Input() control: AbstractControl;
  @Input() listenForChanges: boolean;
  // private controlSubscription: Subscription;
  // Event emitter emitted when the value of the input changes
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiSelectItemRemove = new EventEmitter<any>();
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;
  @Input() listItems:
    | Observable<Array<ISelectItem | CheckboxItem | RadioItem>>
    | Array<ISelectItem | CheckboxItem | RadioItem>;
  // Enumeration of input types
  public inputTypes = InputTypes;
  // String representation of today
  public today: string;
  public formArrayGroup: FormGroup;
  public showPassword = true;

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.today = MomentUtils.parseDate(
      new Date(),
      (this.inputConfig as DateInput).dateInputFormat
        ? (this.inputConfig as DateInput).dateInputFormat
        : 'dd/mm/yyyy'
    );
    if (
      this.inputConfig &&
      this.inputConfig.type === InputTypes.CHECKBOX_INPUT &&
      (this.inputConfig as CheckBoxInput).items.length > 0
    ) {
      this.formArrayGroup = this.builder.group({
        formGroupItems: this.control
      });
    }
    if (this.listenForChanges) {
      this.control.valueChanges.subscribe((value) => {
        this.valueChange.emit(value);
      });
    }
  }

  /**
   * @description Return an abstract control as a [[FormArray]]
   * @param control [[AbstractControl]]
   */
  public asFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  /**
   * @description Returns a dynamic input configuration as a [[SelectInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asSelectInput(input: IHTMLFormControl): SelectInput {
    return input as SelectInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[DateInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asDateInput(input: IHTMLFormControl): DateInput {
    return input as DateInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[CheckBoxInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asCheckBoxInput(input: IHTMLFormControl): CheckBoxInput {
    return input as CheckBoxInput;
  }

  /**
   * @description Returns a dynamic input configuration as a [[RadioInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asRadioInput(input: IHTMLFormControl): RadioInput {
    return input as RadioInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PasswordInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPasswordInput(input: IHTMLFormControl): PasswordInput {
    return input as PasswordInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextInput(input: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextAreaInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asTextAreaInput(input: IHTMLFormControl): TextAreaInput {
    return input as TextAreaInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[NumberInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asNumberInput(input: IHTMLFormControl): NumberInput {
    return input as NumberInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[TextInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asEmailInput(input: IHTMLFormControl): TextInput {
    return input as TextInput;
  }
  /**
   * @description Returns a dynamic input configuration as a [[PhoneInput]]
   * @param input [[IHTMLFormControl]] Dynamic input configurations instance
   */
  public asPhoneInput(input: IHTMLFormControl): PhoneInput {
    return input as PhoneInput;
  }

  public togglePassWordInput() {
    this.showPassword = !this.showPassword;
  }

  isArray(listItems: Observable<any[]>|any[]) {
    return ArrayUtils.isArray(listItems);
  }

  asObservable(listItems: any): Promise<any> {
    return listItems as Promise<any>;
  }

  radioButtonValueChange(event: any) {
    this.control.setValue(event);
  }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }
  ngOnDestroy() {}
}
