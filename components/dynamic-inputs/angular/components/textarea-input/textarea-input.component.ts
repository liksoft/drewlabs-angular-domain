import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { InputInterface } from "../../../core";
import { InputTypeHelper } from "../../services/input-type";
import { InputEventArgs } from "../../types/input";

@Component({
  selector: "ngx-smart-textarea-input",
  templateUrl: "./textarea-input.component.html",
  styles: [
    `
      .clr-control-container textarea {
        min-width: 100% !important;
      }
    `,
  ],
})
export class DynamicTextAreaInputComponent {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: InputInterface;

  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  constructor(public readonly inputType: InputTypeHelper) {}
}
