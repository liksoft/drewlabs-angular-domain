import { Component, Inject, Input, LOCALE_ID } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MomentUtils } from "../../../../../utils";
import { IHTMLFormControl } from "../../../core/contracts";
import { DynamicInputTypeHelper } from "../../services/input-type.service";

@Component({
  selector: "app-dynamic-date-input",
  templateUrl: "./dynamic-date-input.component.html",
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
      :host ::ng-deep .clr-validate-icon.ng-star-inserted {
        display: none;
      }
    `,
  ],
})
export class DynamicDateInputComponent {
  @Input() control!: FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: IHTMLFormControl;

  today = MomentUtils.parseDate();

  constructor(
    public readonly inputType: DynamicInputTypeHelper,
    @Inject(LOCALE_ID) private appLocalID: string
  ) {}

  // tslint:disable-next-line: typedef
  onDateInputBlur() {
    const locale = this.appLocalID;
    if (this.control.value) {
      const value: string = this.control.value as string;
      if (value === "" || value.length === 0) {
        this.control.setValue(null);
        return;
      }
      const match = value.match(
        locale.match(/fr/)
          ? /(0*([1-9]|[12][0-9]|3[01]))\/(0*([1-9]|1[0-2]))\/\d{4}/
          : /(0*([1-9]|1[0-2]))\/(0*([1-9]|[12][0-9]|3[01]))\/\d{4}/
      );
      if (match) {
        return;
      }
      // tslint:disable-next-line: max-line-length
      const output: { days: string; month: string; year: string } = {
        days: value.substr(0, 2),
        month: value.substr(2, 2),
        year: value.substr(4),
      };
      if (locale.match(/fr/)) {
        this.control.setValue(`${output.days}/${output.month}/${output.year}`);
      } else {
        this.control.setValue(`${output.month}/${output.days}/${output.year}`);
      }
    }
  }
}
