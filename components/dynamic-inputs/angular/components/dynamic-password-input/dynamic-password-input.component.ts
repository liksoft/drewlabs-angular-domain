import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { InputTypes } from "../../../core/contracts/input-types";
import { map } from "rxjs/operators";
import { createStateful } from "../../../../../rxjs/helpers";
import { getObjectProperty } from "../../../../../../core/utils";
import { DynamicInputTypeHelper } from "../../services/input-type.service";
import { InputEventArgs } from "../../types/dynamic-inputs";

@Component({
  selector: "app-dynamic-password-input",
  templateUrl: "./dynamic-password-input.component.html",
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
      .required-text,
      .field-has-error {
        color: rgb(241, 50, 50);
      }

      .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }
    `,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicPasswordInputComponent {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;

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

  constructor(public readonly inputType: DynamicInputTypeHelper) {}

  public togglePassWordInput() {
    this._showPassword.next(!this._showPassword.getValue());
  }

  maxNumberSize() {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value: object | number, key?: string) {
    return typeof value === "number"
      ? value
      : getObjectProperty(value, key || "");
  }
}
