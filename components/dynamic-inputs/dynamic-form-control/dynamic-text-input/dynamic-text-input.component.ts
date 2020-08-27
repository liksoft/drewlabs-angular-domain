import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { DynamicInputTypeHelper } from '../input-type.service';
import { InputTypes } from '../../core/contracts/input-types';

@Component({
  selector: 'app-dynamic-text-input',
  templateUrl: './dynamic-text-input.component.html',
  styles: [
    `
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
    .clr-subtext {
        margin-top: 1rem !important;
    }
    `
  ]
})
export class DynamicTextInputComponent {

  @Input() control: AbstractControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;

  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  public inputTypes = InputTypes;

  constructor(public readonly inputTypeHelper: DynamicInputTypeHelper) { }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value: object | number, key: string = null) {
    return typeof value === 'number' ? value : value[key];
  }

}
