import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { InputInterface, InputTypes } from '../../../core';
import { InputTypeHelper } from '../../services/input-type';

@Component({
  selector: 'ngx-smart-radio-input',
  templateUrl: './radio-input.component.html',
  styles: [],
})
export class RadioInputComponent {
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
  private _inputConfig!: InputInterface;
  @Input() set inputConfig(value: InputInterface) {
    this._inputConfig = value;
  }
  get inputConfig() {
    return this._inputConfig;
  }
  @Input() showLabelAndDescription = true;

  public inputTypes = InputTypes;

  constructor(public readonly inputType: InputTypeHelper) {}

  onValueChanges(event: any) {
    this.control.setValue(event);
  }

  inputValue(name: string, value: string) {
    return `${name}_${value}`;
  }
}
