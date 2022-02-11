import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { DynamicInputTypeHelper } from "../../services/input-type.service";
import { InputEventArgs } from "../../types/dynamic-inputs";

@Component({
  selector: "app-dynamic-text-area-input",
  templateUrl: "./dynamic-text-area-input.component.html",
  styles: [
    `
      .clr-control-container textarea {
        min-width: 100% !important;
      }
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
export class DynamicTextAreaInputComponent {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;

  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  constructor(public readonly inputType: DynamicInputTypeHelper) {}
}
