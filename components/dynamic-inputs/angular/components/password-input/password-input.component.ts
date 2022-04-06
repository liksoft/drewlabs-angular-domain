import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { InputInterface, InputTypes } from '../../../core';
import { map } from 'rxjs/operators';
import { createStateful } from '../../../../../rxjs/helpers';
import { getObjectProperty } from '../../../../../utils';
import { InputTypeHelper } from '../../services/input-type';
import { InputEventArgs } from '../../types/input';

@Component({
  selector: 'ngx-smart-password-input',
  templateUrl: './password-input.component.html',
  styles: [
    `
      .password-clr-input-wrapper {
        position: relative;
      }
      .password-trigger {
        position: absolute;
        top: 10px;
        right: 13px;
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent {
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: InputInterface;

  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  public inputTypes = InputTypes;

  // tslint:disable-next-line: variable-name
  private _showPassword = createStateful(false);
  get state$() {
    return this._showPassword
      .asObservable()
      .pipe(map((state) => ({ showPassword: state })));
  }

  constructor(public readonly inputType: InputTypeHelper) {}

  public togglePassWordInput() {
    this._showPassword.next(!this._showPassword.getValue());
  }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value: object | number, key?: string) {
    return typeof value === 'number'
      ? value
      : getObjectProperty(value, key || '');
  }
}
