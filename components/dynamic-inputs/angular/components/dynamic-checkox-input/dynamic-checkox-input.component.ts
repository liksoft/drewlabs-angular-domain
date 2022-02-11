import { Component, Input } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { InputTypes } from "../../../core/contracts/input-types";
import { CheckBoxInput } from "../../../core";
import { DynamicInputTypeHelper } from "../../services/input-type.service";

@Component({
  selector: "app-dynamic-checkox-input",
  templateUrl: "./dynamic-checkox-input.component.html",
  styles: [
    `
      .required-text,
      .field-has-error {
        color: rgb(241, 50, 50);
      }

      .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }
    `,
  ],
})
export class DynamicCheckoxInputComponent {
  // @Input() controlDivContainerClass: string = 'clr-form-control';
  // tslint:disable-next-line: variable-name
  private _control!: FormControl;
  @Input() set control(value: FormControl) {
    this._control = value;
  }
  // tslint:disable-next-line: typedef
  get control(): FormControl {
    return this._control as FormControl;
  }

  // tslint:disable-next-line: variable-name
  private _inputConfig!: IHTMLFormControl;
  @Input() set inputConfig(value: IHTMLFormControl) {
    this._inputConfig = value;
    if (
      this.inputConfig &&
      this.inputConfig.type === this.inputTypes.CHECKBOX_INPUT &&
      (this.inputConfig as CheckBoxInput).items.length > 0
    ) {
      this.formArrayGroup = this.builder.group({
        formGroupItems: this.control,
      });
    }
  }
  // tslint:disable-next-line: typedef
  get inputConfig() {
    return this._inputConfig;
  }

  @Input() showLabelAndDescription = true;

  public inputTypes = InputTypes;
  public formArrayGroup!: FormGroup;

  constructor(
    private builder: FormBuilder,
    public readonly inputType: DynamicInputTypeHelper
  ) {}
}
