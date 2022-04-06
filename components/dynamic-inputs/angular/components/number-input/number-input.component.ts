import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { getObjectProperty } from "../../../../../utils";
import { InputInterface } from "../../../core";
import { InputTypeHelper } from "../../services/input-type";
import { InputEventArgs } from "../../types/input";

@Component({
  selector: "ngx-smart-number-input",
  templateUrl: "./number-input.component.html",
  styles: [],
})
export class NumberInputComponent {
  @Input() control!: FormControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig!: InputInterface;
  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();

  constructor(public readonly inputType: InputTypeHelper) {}

  maxNumberSize(): number {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value?: object | number, key?: string): number | string {
    return typeof value === "number"
      ? value
      : getObjectProperty(value, key || "");
  }
}
