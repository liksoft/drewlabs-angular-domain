import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { InputInterface, InputTypes } from '../../../core';
import { getObjectProperty } from '../../../../../utils';
import { InputTypeHelper } from '../../services/input-type';
import { InputEventArgs } from '../../types/input';

@Component({
  selector: 'ngx-smart-text-input',
  templateUrl: './text-input.component.html',
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
export class TextInputComponent {
  @Input() controlDivContainerClass: string = 'clr-form-control';
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: InputInterface;

  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  public inputTypes = InputTypes;

  constructor(public readonly inputType: InputTypeHelper) {}

  maxNumberSize = () => Math.pow(2, 31) - 1;

  getErrorAsNumber(value: { [index: string]: any } | number, key?: string) {
    return typeof value === 'number'
      ? value
      : getObjectProperty(value, key || '');
  }
}
