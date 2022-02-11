import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { InputTypes } from "../../../core/contracts/input-types";
import {
  getObjectProperty,
  maxNumberSize as utilsMaxNumberSize,
} from "../../../../../utils";
import { DynamicInputTypeHelper } from "../../services/input-type.service";
import { InputEventArgs } from "../../types/dynamic-inputs";

@Component({
  selector: "app-dynamic-text-input",
  templateUrl: "./dynamic-text-input.component.html",
  styles: [
    `
      .required-text,
      .field-has-error {
        color: rgb(241, 50, 50);
      }

      .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }
      /* .clr-subtext {
        margin-top: 1rem !important;
    } */
    `,
  ],
})
export class DynamicTextInputComponent {
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

  constructor(public readonly inputType: DynamicInputTypeHelper) {}

  maxNumberSize = () => utilsMaxNumberSize();

  getErrorAsNumber(value: { [index: string]: any } | number, key?: string) {
    return typeof value === "number"
      ? value
      : getObjectProperty(value, key || "");
  }
}
