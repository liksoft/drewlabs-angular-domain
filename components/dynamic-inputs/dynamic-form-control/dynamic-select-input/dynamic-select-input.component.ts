import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynamicInputTypeHelper } from '../input-type.service';
import { SelectInput } from '../../core/input-types';
import { createStateful } from '../../../../rxjs/helpers/index';

@Component({
  selector: 'app-dynamic-select-input',
  templateUrl: './dynamic-select-input.component.html',
  styles: [
    `
    /* .clr-select-wrapper {
      min-width: 100% !important;
    } */

    .ng-select {
      display: block;
      min-width: 100% !important;
    }

    .ng-select.flat {
      border-radius: 0 !important;
    }

    .ng-select.flat .ng-select-container {
      border-radius: 0 !important;
    }
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
    :host ::ng-deep .ng-select .ng-select-container, :host ::ng-deep .ng-select.ng-select-single .ng-select-container {
      min-height: 26px;
    }
    :host ::ng-deep .ng-select.ng-select-single .ng-select-container {
      height: 26px;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSelectInputComponent {
  @Input() control: AbstractControl;
  @Input() showLabelAndDescription = true;
  // tslint:disable-next-line: variable-name
  _inputItems$ = createStateful([]);
  @Input() set inputItems(value: { [index: string]: any }[]) {
    this._inputItems$.next(value);
  }
  inputItems$ = this._inputItems$.asObservable();

  // tslint:disable-next-line: variable-name
  private _inputConfig: SelectInput;
  @Input() set inputConfig(value: SelectInput) {
    this._inputConfig = value as SelectInput;
  }
  // tslint:disable-next-line: typedef
  get inputConfig() {
    return this._inputConfig;
  }
  @Output() multiSelectItemRemove = new EventEmitter<any>();

  constructor(public readonly inputTypeHelper: DynamicInputTypeHelper) { }

}
