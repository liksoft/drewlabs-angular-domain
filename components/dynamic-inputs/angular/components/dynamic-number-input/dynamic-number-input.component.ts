import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { getObjectProperty } from "../../../../../../core/utils";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { DynamicInputTypeHelper } from "../../services/input-type.service";
import { InputEventArgs } from "../../types/dynamic-inputs";

@Component({
  selector: "app-dynamic-number-input",
  templateUrl: "./dynamic-number-input.component.html",
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
export class DynamicNumberInputComponent {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;
  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  constructor(public readonly inputType: DynamicInputTypeHelper) {}

  maxNumberSize(): number {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value?: object | number, key?: string): number | string {
    return typeof value === "number"
      ? value
      : getObjectProperty(value, key || "");
  }
}
