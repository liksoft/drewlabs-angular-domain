import { IHTMLFormControl, InputTypes } from "../../core";
import { FormGroup } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SelectableControlItems } from "../types";

@Component({
  selector: "app-dynamic-inputs",
  templateUrl: "./dynamic-form-control.component.html",
  styleUrls: ["./dynamic-form-control.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormControlComponent {
  // tslint:disable-next-line: variable-name
  @Input() control!: AbstractControl;
  @Input() class: string = "clr-form-control";
  @Input() inline: boolean = false;
  @Input() showLabelAndDescription = true;

  @Output() multiSelectItemRemove = new EventEmitter<any>();
  // tslint:disable-next-line: variable-name
  @Input() inputConfig!: IHTMLFormControl;
  @Input() listItems!: SelectableControlItems;

  public inputTypes = InputTypes;
  // String representation of today
  public formArrayGroup!: FormGroup;

  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  @Input() listenForChanges!: boolean;
}

// For compatibility issues
export { FileFormControl } from "../types";
