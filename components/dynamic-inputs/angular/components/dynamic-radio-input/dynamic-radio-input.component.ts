import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IHTMLFormControl } from '../../../core/contracts/dynamic-input';
import { InputTypes } from '../../../core/contracts/input-types';
import { DynamicInputTypeHelper } from '../../services/input-type.service';

@Component({
  selector: 'app-dynamic-radio-input',
  templateUrl: './dynamic-radio-input.component.html',
  styles: [
    `
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
    `
  ]
})
export class DynamicRadioInputComponent {

  @Input() inline: boolean = true;

  // tslint:disable-next-line: variable-name
  private _control!: AbstractControl;
  @Input() set control(value: AbstractControl) {
    this._control = value;
  }
  get control() {
    return this._control;
  }
  // tslint:disable-next-line: variable-name
  private _inputConfig!: IHTMLFormControl;
  @Input() set inputConfig(value: IHTMLFormControl) {
    this._inputConfig = value;
  }
  get inputConfig() {
    return this._inputConfig;
  }
  @Input() showLabelAndDescription = true;

  public inputTypes = InputTypes;

  constructor(
    public readonly inputType: DynamicInputTypeHelper
  ) {}

  onValueChanges(event: any) {
    this.control.setValue(event);
  }


  inputValue(name: string, value: string) {
    return `${name}_${value}`;
  }

}
