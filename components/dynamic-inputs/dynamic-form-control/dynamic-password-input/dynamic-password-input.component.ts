import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { DynamicInputTypeHelper } from '../input-type.service';
import { InputTypes } from '../../core/contracts/input-types';
import { map } from 'rxjs/operators';
import { createStateful } from '../../../../rxjs/helpers';

@Component({
  selector: 'app-dynamic-password-input',
  templateUrl: './dynamic-password-input.component.html',
  styles: [`
    .password-clr-input-wrapper {
      position: relative;
    }

    .password-trigger {
      position: absolute;
      top: 10px;
      right: 13px;
      cursor: pointer;
    }
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
  `],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicPasswordInputComponent {
  @Input() controlDivContainerClass: string = 'clr-form-control';
  @Input() control: AbstractControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;

  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  public inputTypes = InputTypes;

  // tslint:disable-next-line: variable-name
  private _showPassword = createStateful(false);
  get state$() {
    return this._showPassword.asObservable().pipe(
      map(state => ({showPassword: state}))
    );
  }

  constructor(public readonly inputTypeHelper: DynamicInputTypeHelper) {}

  public togglePassWordInput() {
    this._showPassword.next(!this._showPassword.getValue());
  }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value: object | number, key: string = null) {
    return typeof value === 'number' ? value : value[key];
  }
}
