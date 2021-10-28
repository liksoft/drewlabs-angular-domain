import { IHTMLFormControl, InputTypes } from "../../core";
import { FormGroup } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { InputEventArgs, SelectableControlItems } from "../types";
import { takeUntil, tap } from "rxjs/operators";
import { createSubject } from "../../../../rxjs/helpers";

@Component({
  selector: "app-dynamic-inputs",
  templateUrl: "./dynamic-form-control.component.html",
  styleUrls: ["./dynamic-form-control.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormControlComponent implements OnDestroy, OnInit {
  // tslint:disable-next-line: variable-name
  @Input() class: string = "clr-form-control";
  @Input() inline: boolean = false;
  @Input() showLabelAndDescription = true;
  // tslint:disable-next-line: variable-name
  @Input() inputConfig!: IHTMLFormControl;
  @Input() listItems!: SelectableControlItems;
  @Input() listenForChanges!: boolean;
  private _control!: AbstractControl;
  @Input() set control(value: AbstractControl) {
    this._control = value;
  }
  get control() {
    return this._control;
  }
  @Input() name!: string;

  @Output() multiSelectItemRemove = new EventEmitter<any>();
  @Output() selected = new EventEmitter<InputEventArgs>();

  public inputTypes = InputTypes;
  // String representation of today
  public formArrayGroup!: FormGroup;

  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  @Output("focus") focus = new EventEmitter<InputEventArgs>();
  @Output("keydown") keydown = new EventEmitter<InputEventArgs>();
  @Output("keyup") keyup = new EventEmitter<InputEventArgs>();
  @Output("keypress") keypress = new EventEmitter<InputEventArgs>();
  @Output("blur") blur = new EventEmitter<InputEventArgs>();

  private _destroy$ = createSubject();
  @Output() valueChange = new EventEmitter<any>();

  ngOnInit() {
    this._control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((source) => this.valueChange.emit(source))
      )
      .subscribe();
  }

  getInlineTextAreaInput(input: IHTMLFormControl) {
    return {
      ...input,
      classes: input.classes?.includes("clr-textarea")
        ? input.classes?.replace("textarea", "input")
        : `${input?.classes} clr-input`,
    };
  }

  getControlContainerClass = () =>
    this.inline ? `clr-form-control inline` : `clr-form-control`;

  ngOnDestroy() {
    this._destroy$.next();
  }
}

// For compatibility issues
export { FileFormControl } from "../types";
