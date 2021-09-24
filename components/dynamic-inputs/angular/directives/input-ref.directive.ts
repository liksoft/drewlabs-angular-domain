import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { takeUntil, tap } from "rxjs/operators";
import { createSubject } from "src/app/lib/core/rxjs/helpers";
import { InputEventArgs } from "../types";

@Directive({
  selector: "[drewlabsInputRef]",
})
export class InputRefDirective implements OnDestroy {
  private _destroy$ = createSubject();

  //#region directive inputs
  private _control!: AbstractControl;
  @Input("drewlabsInputRef") set control(value: AbstractControl) {
    this._control = value;
    this._control.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((source) => this.valueChange.emit(source))
      )
      .subscribe();
  }
  @Input() name!: string;
  //!#endregion Directive inputs

  //#region Directive outputs
  @Output() focus = new EventEmitter<InputEventArgs>();
  @Output() keydown = new EventEmitter<InputEventArgs>();
  @Output() keyup = new EventEmitter<InputEventArgs>();
  @Output() keypress = new EventEmitter<InputEventArgs>();
  @Output() blur = new EventEmitter<InputEventArgs>();
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  //!#endregion Directive outputs

  @HostListener("focus")
  onFocus() {
    this.focus.emit({ name: this.name, value: this._control?.value });
  }

  @HostListener("keydown")
  onKeyDown() {
    this.keydown.emit({ name: this.name, value: this._control?.value });
  }

  @HostListener("keyup")
  onKeyUp() {
    this.keyup.emit({ name: this.name, value: this._control?.value });
  } //

  @HostListener("keypress")
  onKeyPress() {
    this.keypress.emit({ name: this.name, value: this._control?.value });
  }

  @HostListener("blur")
  onBlur() {
    this.blur.emit({ name: this.name, value: this._control?.value });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
