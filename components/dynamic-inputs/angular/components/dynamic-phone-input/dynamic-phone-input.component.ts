import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { IHTMLFormControl } from "../../../core/contracts/dynamic-input";
import { DynamicInputTypeHelper } from "../../services/input-type.service";

@Component({
  selector: "app-dynamic-phone-input",
  templateUrl: "./dynamic-phone-input.component.html",
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
export class DynamicPhoneInputComponent {
  @Input() controlDivContainerClass: string = "clr-form-control";
  @Input() control!: AbstractControl & FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;

  constructor(public readonly inputType: DynamicInputTypeHelper) {}
}
