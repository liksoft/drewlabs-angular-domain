import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { timeout } from '../../../../../rxjs/helpers';
import { IDynamicForm, InputInterface } from '../../../core';
import { AngularReactiveFormBuilderBridge } from '../../types';
import {
  ComponentReactiveFormHelpers,
  controlAttributesDataBindings,
  createHiddenAttributeSetter,
  setControlsAttributes,
} from '../../helpers';
import {
  ANGULAR_REACTIVE_FORM_BRIDGE,
  BindingInterface,
  ControlsStateMap,
  FormComponentInterface,
} from '../../types';

@Component({
  selector: 'ngx-smart-form',
  templateUrl: './ngx-smart-form.component.html',
  styles: [
    `
      :host ::ng-deep .clr-input,
      :host ::ng-deep .clr-control-container,
      :host ::ng-deep .clr-input-wrapper {
        width: 100%;
      }

      div.control__group__header,
      :host ::ng-deep div.control__group__header {
        font-size: 1rem;
        letter-spacing: normal;
        line-height: 1.2rem;
        margin-top: 1.2rem;
        margin-bottom: 0;
        font-weight: var(--clr-h3-font-weight, 200);
        color: var(--clr-h3-color, black);
      }
      :host ::ng-deep .required-text,
      :host ::ng-deep .field-has-error {
        color: rgb(241, 50, 50);
      }
      :host ::ng-deep .clr-input-wrapper .clr-input:disabled {
        background: rgba(244, 244, 244, 0.3);
      }
      .ngx-smart-form-control,
      :host ::ng-deep .ngx-smart-form-control {
        margin: 0;
        padding: 0;
        margin-top: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxSmartFormComponent
  implements FormComponentInterface, OnDestroy
{
  //#region Local properties
  formGroup!: FormGroup;
  internal!: IDynamicForm;
  //#endregion Local properties

  //#region Component inputs
  @Input() template!: TemplateRef<Node>;
  @Input() addTemplate!: TemplateRef<Node>;
  @Input() performingAction = false;
  @Input() disabled = false;
  @Input() submitable = true;
  @Input() set form(value: IDynamicForm) {
    this.setComponentForm(value);
  }
  get form() {
    return this.internal;
  }
  //#endregion Component inputs

  //#region Component outputs
  @Output() submit = new EventEmitter<{ [index: string]: any }>();
  @Output() readyState = new EventEmitter();
  @Output() formGroupChange = new EventEmitter<FormGroup>();
  //#endregion Component outputs

  // @internal
  private _destroy$ = new Subject<void>();

  @HostListener('keyup.enter', ['$event'])
  onEnterButtonCliked(event: KeyboardEvent) {
    if (!this.performingAction) {
      this.onSubmit(event);
    }
  }

  //#region Content
  @ContentChild('submitButton') submitButtonRef!: TemplateRef<Node>;
  //#endregion Component Injected Templates

  public constructor(
    @Inject(ANGULAR_REACTIVE_FORM_BRIDGE)
    private builder: AngularReactiveFormBuilderBridge
  ) {}

  //#region FormComponent interface Methods definitions
  controlValueChanges(control: string): Observable<unknown> {
    const control_ = this.formGroup?.get(control);
    if (control_) {
      return control_.valueChanges;
    }
    return EMPTY;
  }

  getControlValue(control: string, _default?: any): unknown {
    const value = this.formGroup.get(control)?.value;
    return value || _default || undefined;
  }
  setControlValue(control: string, value: any): void {
    this.formGroup.get(control)?.setValue(value);
  }
  disableControls(controls: ControlsStateMap): void {
    for (const [key, entry] of Object.entries(controls)) {
      this.formGroup.get(key)?.disable(entry);
    }
  }
  enableControls(controls: ControlsStateMap): void {
    for (const [key, entry] of Object.entries(controls)) {
      this.formGroup.get(key)?.enable(entry);
    }
  }
  addControl(name: string, control: AbstractControl): void {
    if (this.formGroup.get(name)) {
      return this.formGroup.get(name)?.setValue(control.value);
    }
    this.formGroup.addControl(name, control);
  }
  getControl(name: string): AbstractControl | undefined {
    return this.formGroup.get(name) ?? undefined;
  }
  onSubmit(event: Event): void | Observable<unknown> {
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formGroup);
    if (this.formGroup.valid) {
      this.submit.emit(this.formGroup.getRawValue());
    }
    event.preventDefault();
  }
  setComponentForm(value: IDynamicForm): void {
    if (value) {
      // We set the controls container class
      const controls = (value.controlConfigs ?? []).map((current) => ({
        ...current,
        containerClass: false
          ? 'clr-col-md-12'
          : current.containerClass ?? 'clr-col-md-12',
        isRepeatable: current.isRepeatable ?? false,
      }));
      //
      this.internal = { ...value, controlConfigs: controls };
      // We unregister from previous event each time we set the
      // form value
      this._destroy$.next();
      // We create an instance of angular Reactive Formgroup instance
      // from input configurations
      this.formGroup = this.builder.group(value) as FormGroup;
      // Set input bindings
      this.setBindings();
      // Subscribe to formgroup changes
      this.formGroup.valueChanges
        .pipe(
          tap((state) => this.formGroupChange.emit(state)),
          takeUntil(this._destroy$)
        )
        .subscribe();

      // Timeout and notify parent component
      // of ready state
      timeout(() => {
        this.readyState.emit();
      }, 20);
    }
  }
  validateForm(): void {
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formGroup);
  }
  reset(): void {
    this.formGroup.reset();
    for (const control of this.internal.controlConfigs ?? []) {
      this.formGroup.get(control.formControlName)?.setValue(control.value);
    }
  }
  //#endregion FormComponent interface Methods definitions

  setBindings() {
    if (this.internal && this.formGroup) {
      const [bindings, formgroup, controls] = controlAttributesDataBindings(
        this.internal.controlConfigs ?? []
      )(this.formGroup);
      this.internal = {
        ...this.internal,
        controlConfigs: controls as InputInterface[],
      };
      this.formGroup = formgroup as FormGroup;
      // Get control entries from the formgroup
      const entries = Object.entries(this.formGroup.controls);
      // Handle form control value changes
      for (const [name, abstractControl] of entries) {
        abstractControl.valueChanges
          .pipe(
            tap((state) =>
              this.handleControlChanges(
                state,
                name,
                bindings as Map<string, BindingInterface>
              )
            ),
            takeUntil(this._destroy$)
          )
          .subscribe();
      }
    }
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(
    event: any,
    name: string,
    bindings: Map<string, BindingInterface>
  ) {
    for (const current of bindings.values()) {
      if (current.binding?.formControlName.toString() === name.toString()) {
        const [control, controls] = setControlsAttributes(
          this.internal.controlConfigs ?? [],
          current,
          event,
          createHiddenAttributeSetter
        )(this.formGroup);
        this.formGroup = control as FormGroup;
        this.internal = { ...this.internal, controlConfigs: controls };
      }
    }
  }
  //#endregion Ported wrapper methods

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
