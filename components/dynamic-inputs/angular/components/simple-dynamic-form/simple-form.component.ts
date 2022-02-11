import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { createSubject, timeout } from "../../../../../rxjs/helpers";
import { IDynamicForm, IHTMLFormControl } from "../../../core/contracts";
import { createform } from "../../../core/helpers";
import { AngularReactiveFormBuilderBridge } from "../../contracts";
import { ComponentReactiveFormHelpers } from "../../helpers";
import { ANGULAR_REACTIVE_FORM_BRIDGE } from "../../types";

@Component({
  selector: "app-simple-dynamic-form",
  templateUrl: "./simple-form.component.html",
  styles: [],
})
export class SimpleDynamicFormComponent implements OnDestroy {
  // Properties definitions
  _formgroup!: FormGroup;
  _form!: IDynamicForm;

  // Inputs
  @Input() set form(value: IDynamicForm) {
    this._form = value;
    if (value) {
      this._formgroup = this.builder.group(value) as FormGroup;
      timeout(() => {
        this.componentReadyStateChanges.emit();
      }, 300);
    }
  }
  get form() {
    return this._form;
  }
  get formgroup() {
    return this._formgroup;
  }
  @Input() performingAction = false;
  @Input() buttonDisabled = false;
  @Input() submitable: boolean = true;

  // Outputs
  @Output() public formEvent = new EventEmitter<{ [index: string]: any }>();
  @Output() public componentReadyStateChanges = new EventEmitter();
  public readonly destroy$ = createSubject<void>();

  @HostListener("keyup.enter", ["$event"])
  onEnterButtonCliked(event: KeyboardEvent) {
    if (!this.performingAction) {
      this.onFormSubmitted(event);
    }
  }

  public constructor(
    @Inject(ANGULAR_REACTIVE_FORM_BRIDGE)
    private builder: AngularReactiveFormBuilderBridge
  ) {}

  listenFormControlChanges = (control: string) =>
    this._formgroup?.get(control)?.valueChanges;

  getControlValue = (control: string, _default?: any) =>
    this._formgroup.get(control)?.value ?? _default ?? undefined;

  setControlValue = (control: string, value: any) =>
    this._formgroup.get(control)?.setValue(value);

  disableControls = (controls: {
    [index: string]: { onlySelf: boolean; emitEvent: boolean } | undefined;
  }) =>
    Object.entries(controls || {}).forEach(([key, entry]) =>
      this.formgroup.get(key)?.disable(entry)
    );

  enableControls = (controls: {
    [index: string]: { onlySelf: boolean; emitEvent: boolean } | undefined;
  }) =>
    Object.entries(controls ?? {}).forEach(([key, entry]) =>
      this.formgroup.get(key)?.enable(entry)
    );

  addControl = (name: string, control: AbstractControl) =>
    this._formgroup.get(name)
      ? this._formgroup.get(name)?.setValue(control.value)
      : this._formgroup.addControl(name, control);

  getControl = (name: string) => this.formgroup.get(name);

  onFormSubmitted(event: Event) {
    this.validateForm();
    if (this._formgroup.valid) {
      this.formEvent.emit(this._formgroup.getRawValue());
    }
    event.preventDefault();
  }

  setComponentForm(value: IDynamicForm) {
    if (value) {
      this._form = value;
      this._formgroup = this.builder.group(value) as FormGroup;
    }
  }

  getControlConfig = (name: string) =>
    [...(this._form.controlConfigs ?? [])].find(
      (control) => control.formControlName === name
    );

  setControlConfig(config?: IHTMLFormControl, name?: string) {
    if (config) {
      name = name ?? config.formControlName;
      const controls = [...(this._form.controlConfigs ?? [])];
      const index = controls.findIndex(
        (control) => control.formControlName === name
      );
      controls.splice(index, 1, config);
      this._form = createform({
        ...this._form,
        controlConfigs: controls,
      });
    }
  }

  validateForm() {
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formgroup);
    return this.formgroup;
  }

  public reset() {
    this.formgroup.reset();
    this._form.controlConfigs?.forEach((control) => {
      this.formgroup.get(control.formControlName)?.setValue(control.value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
