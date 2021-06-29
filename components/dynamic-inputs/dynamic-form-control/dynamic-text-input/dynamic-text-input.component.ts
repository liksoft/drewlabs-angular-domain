import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { DynamicInputTypeHelper } from '../input-type.service';
import { InputTypes } from '../../core/contracts/input-types';
import { getObjectProperty, maxNumberSize as utilsMaxNumberSize} from 'src/app/lib/core/utils';

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
    /* .clr-subtext {
        margin-top: 1rem !important;
    } */
    `
  ]
})
export class DynamicTextInputComponent {

  @Input() controlDivContainerClass: string = 'clr-form-control';
  @Input() control!: AbstractControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;

  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  public inputTypes = InputTypes;

  constructor(public readonly inputTypeHelper: DynamicInputTypeHelper) { }

  maxNumberSize = () => utilsMaxNumberSize()

  getErrorAsNumber(value: {[index: string]: any} | number, key?: string) {
    return typeof value === 'number' ? value : getObjectProperty(value, key || '');
  }

}
