import { InputInterface, InputTypes } from '../../../core';
import { AbstractControl, FormControl } from '@angular/forms';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { InputEventArgs, SelectableControlItems } from '../../types';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InputTypeHelper } from '../../services';

@Component({
  selector: 'ngx-smart-form-control',
  templateUrl: './ngx-smart-form-control.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxSmartFormControlComponent implements OnDestroy, OnInit {
  // Component properties
  public inputTypes = InputTypes;
  private _destroy$ = new Subject<void>();

  //#region Component inputs
  @Input() class: string = 'clr-form-control';
  @Input() inline: boolean = false;
  @Input() showLabelAndDescription = true;
  @Input() inputConfig!: InputInterface;
  @Input() listItems!: SelectableControlItems;
  private _control!: AbstractControl & FormControl;
  @Input() set control(value: AbstractControl & FormControl) {
    this._control = value;
  }
  get control() {
    return this._control as AbstractControl & FormControl;
  }
  @Input() name!: string;
  //#endregion Component inputs

  //#region Component outputs
  @Output() selectItemRemoved = new EventEmitter<any>();
  @Output() selected = new EventEmitter<InputEventArgs>();
  @Output() fileAdded = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  @Output('focus') focus = new EventEmitter<InputEventArgs>();
  @Output('keydown') keydown = new EventEmitter<InputEventArgs>();
  @Output('keyup') keyup = new EventEmitter<InputEventArgs>();
  @Output('keypress') keypress = new EventEmitter<InputEventArgs>();
  @Output('blur') blur = new EventEmitter<InputEventArgs>();
  // Value changes emitters
  @Output() valueChange = new EventEmitter<InputEventArgs>();
  //#endregion Component outputs

  constructor(public readonly inputType: InputTypeHelper) {}

  ngOnInit() {
    this._control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((source) =>
          this.valueChange.emit({
            name: this.inputConfig.formControlName,
            value: source,
          })
        )
      )
      .subscribe();
  }

  getInlineTextAreaInput(input: InputInterface) {
    return {
      ...input,
      classes: input.classes?.includes('clr-textarea')
        ? input.classes?.replace('textarea', 'input')
        : `${input?.classes} clr-input`,
    };
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
