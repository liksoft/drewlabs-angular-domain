import {
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
} from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { JSObject } from "../../../../../utils";
import { timeout } from "../../../../../rxjs/helpers";
import { IDynamicForm, sortformbyindex } from "../../../core";
import { AngularReactiveFormBuilderBridge } from "../../contracts";
import {
  applyAttribute,
  applyHiddenAttributeCallback,
  ComponentReactiveFormHelpers,
  getControlBinding,
} from "../../helpers";
import {
  ANGULAR_REACTIVE_FORM_BRIDGE,
  ControlBindings,
  ControlsStateMap,
  FormComponentInterface,
} from "../../types";

@Component({
  selector: "ngx-smart-form",
  templateUrl: "./ngx-smart-form.component.html",
})
export class NgxSmartFormComponent
  implements FormComponentInterface, OnDestroy
{
  formgroup!: FormGroup;
  internal!: IDynamicForm;

  @Input() performingAction = false;
  @Input() disabled = false;
  @Input() submitable = true;
  @Input() submitText: string = "Submit";
  @Input() submitClass: string = "Submit";
  @Input() set form(value: IDynamicForm) {
    this.setComponentForm(value);
  }
  get form() {
    return this.internal;
  }

  // Component outputs
  @Output() submit = new EventEmitter<{ [index: string]: any }>();
  @Output() readyState = new EventEmitter();
  @Output() formGroupChange = new EventEmitter<FormGroup>();

  // @internal
  private _destroy$ = new Subject<void>();

  @HostListener("keyup.enter", ["$event"])
  onEnterButtonCliked(event: KeyboardEvent) {
    if (!this.performingAction) {
      this.onSubmit(event);
    }
  }

  @ContentChild("smartInput", { static: false })
  smartInputRef!: TemplateRef<any>;

  public constructor(
    @Inject(ANGULAR_REACTIVE_FORM_BRIDGE)
    private builder: AngularReactiveFormBuilderBridge
  ) {}

  //#region FormComponent interface Methods definitions
  controlValueChanges(control: string): Observable<unknown> {
    return this.formgroup?.get(control)?.valueChanges;
  }

  getControlValue(control: string, _default?: any): unknown {
    const value = this.formgroup.get(control)?.value;
    return value || _default || undefined;
  }
  setControlValue(control: string, value: any): void {
    this.formgroup.get(control)?.setValue(value);
  }
  disableControls(controls: ControlsStateMap): void {
    for (const [key, entry] of Object.entries(controls)) {
      this.formgroup.get(key)?.disable(entry);
    }
  }
  enableControls(controls: ControlsStateMap): void {
    for (const [key, entry] of Object.entries(controls)) {
      this.formgroup.get(key)?.enable(entry);
    }
  }
  addControl(name: string, control: AbstractControl): void {
    if (this.formgroup.get(name)) {
      return this.formgroup.get(name)?.setValue(control.value);
    }
    this.formgroup.addControl(name, control);
  }
  getControl(name: string): AbstractControl {
    return this.formgroup.get(name);
  }
  onSubmit(event: Event): void | Observable<unknown> {
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formgroup);
    if (this.formgroup.valid) {
      this.submit.emit(this.formgroup.getRawValue());
    }
    event.preventDefault();
  }
  setComponentForm(value: IDynamicForm): void {
    this.internal = value;
    if (value) {
      this._destroy$.next();
      // We create an instance of angular Reactive Formgroup instance
      // from input configurations
      this.formgroup = this.builder.group(value) as FormGroup;
      // Set input bindings
      this.setBindings();
      // Subscribe to formgroup changes
      this.formgroup.valueChanges
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
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formgroup);
  }
  reset(): void {
    this.formgroup.reset();
    for (const control of this.internal.controlConfigs) {
      this.formgroup.get(control.formControlName)?.setValue(control.value);
    }
  }
  //#endregion FormComponent interface Methods definitions

  //#region Ported wrapper methods
  // private _bindings$ = new BehaviorSubject<ControlBindings>(
  //   {} as ControlBindings
  // );
  // bindings$ = this._bindings$.asObservable();

  setBindings() {
    if (this.internal && this.formgroup) {
      const { bindings, form, formgroup } = getControlBinding(
        sortformbyindex(this.internal)
      )(this.formgroup);
      this.internal = form;
      this.formgroup = formgroup as FormGroup;
      // Handle form control value changes
      for (const [name, abstractControl] of Object.entries(
        this.formgroup.controls
      )) {
        abstractControl.valueChanges
          .pipe(
            tap((state) => this.handleControlChanges(state, name, bindings)),
            takeUntil(this._destroy$)
          )
          .subscribe();
      }
    }
  }

  // tslint:disable-next-line: typedef
  shouldListenforChange(controlName: string, bindings: ControlBindings) {
    const control_ = Object.values(bindings).find((control) => {
      return control.binding?.formControlName === controlName;
    });
    return control_ ? true : false;
  }

  // tslint:disable-next-line: typedef
  handleControlChanges(event: any, name: string, bindings: ControlBindings) {
    const configs = Object.values(bindings).filter(
      (controlBinding) =>
        controlBinding.binding?.formControlName.toString() === name.toString()
    );
    if (Array.isArray(configs)) {
      configs.forEach((item) => {
        const { control, dynamicForm } = applyAttribute(
          this.internal,
          item,
          event,
          applyHiddenAttributeCallback
        )(this.formgroup);
        this.formgroup = control as FormGroup;
        this.internal = dynamicForm;
      });
    }
  }

  // getContainerClass(clazz: string): string {
  //   const clazz_ = this.singleColumn ? this.containerClass : clazz;
  //   return clazz_ ?? this.containerClass;
  // }

  hasInputs(value: IDynamicForm) {
    return (value?.controlConfigs || []).length !== 0;
  }

  asFormControl(control: AbstractControl) {
    return control as FormControl;
  }
  //#endregion Ported wrapper methods

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
