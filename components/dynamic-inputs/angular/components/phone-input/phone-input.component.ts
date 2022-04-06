import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { InputInterface } from "../../../core";
import { InputTypeHelper } from "../../services/input-type";

@Component({
  selector: "ngx-smart-phone-input",
  templateUrl: "./phone-input.component.html",
  styles: [
    `
      .required-text,
      .field-has-error {
        color: rgb(241, 50, 50);
      }

      .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }

      :host ::ng-deep .clr-subtext {
        margin-top: 1rem !important;
        /* margin-left: 3.5rem; */
      }
      .clr-control-label {
        margin-bottom: 12px;
      }
    `,
  ],
})
export class PhoneInputComponent {
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: InputInterface;

  constructor(public readonly inputType: InputTypeHelper) {}
}
