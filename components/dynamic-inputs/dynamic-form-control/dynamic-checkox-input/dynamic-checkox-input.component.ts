import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { DynamicInputTypeHelper } from '../input-type.service';
import { InputTypes } from '../../core/contracts/input-types';
import { CheckBoxInput } from '../../core';


@Component({
  selector: 'app-dynamic-checkox-input',
  templateUrl: './dynamic-checkox-input.component.html',
  styles: [`
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }

  `]
})
export class DynamicCheckoxInputComponent {

  // tslint:disable-next-line: variable-name
  private _control: AbstractControl;
  @Input() set control(value: AbstractControl) {
    this._control = value;
  }
  // tslint:disable-next-line: typedef
  get control() {
    return this._control;
  }

  // tslint:disable-next-line: variable-name
  private _inputConfig: IHTMLFormControl;
  @Input() set inputConfig(value: IHTMLFormControl) {
    this._inputConfig = value;
    if (
      this.inputConfig &&
      this.inputConfig.type === InputTypes.CHECKBOX_INPUT &&
      (this.inputConfig as CheckBoxInput).items.length > 0
    ) {
      this.formArrayGroup = this.builder.group({
        formGroupItems: this.control
      });
    }
  }
  // tslint:disable-next-line: typedef
  get inputConfig() {
    return this._inputConfig;
  }

  @Input() showLabelAndDescription = true;

  public inputTypes = InputTypes;
  public formArrayGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    public readonly inputTypeHelper: DynamicInputTypeHelper
  ) { }
}
