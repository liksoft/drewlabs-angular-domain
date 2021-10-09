import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import {
  FormArray,
  FormGroup,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { IDynamicForm } from "../../../core/contracts/dynamic-form";
import { RepeatableGroupChildComponent } from "./repeatable-group-child/repeatable-group-child.component";
import { DynamicComponentService } from "../../../../services/dynamic-component-resolver";
import { createSubject } from "../../../../../rxjs/helpers/creator-functions";
import { takeUntil } from "rxjs/operators";
import { sortformbyindex, copyform } from "../../../core/helpers";
import { ChildComponent } from "./types";

@Component({
  selector: "app-dynamic-repetable-group",
  templateUrl: "./dynamic-repetable-group.component.html",
  styles: [
    `
      .clr-offset-margin-right {
        margin-right: -0.5rem !important;
      }
    `,
  ],
})
export class DynamicRepetableGroupComponent implements OnDestroy {
  // Component detruction listener
  private _destroy$ = createSubject();
  // #region Component inputs
  @Input() control!: FormArray;
  @Input() addButtonText = "Plus";
  @Input() buttonDisabled = false;
  @Input() prefixLabel!: string;
  // tslint:disable-next-line: no-inferrable-types
  @Input() singleColumnView: boolean = false;
  // #endregion Component inputs

  // #region Component outputs
  @Output() addNewControlGroup: EventEmitter<object> = new EventEmitter();
  @Output() removedControlGroup = new EventEmitter<object>();
  // #endregion Component outputs

  private controlsContainerRefs: ComponentRef<ChildComponent>[] = [];
  @ViewChild("controlsContainer", { read: ViewContainerRef, static: true })
  controlsContainer!: ViewContainerRef;
  private total = 0;

  constructor(private service: DynamicComponentService<ChildComponent>) {}

  // tslint:disable-next-line: typedef
  addChildComponent(
    index: number,
    state: AbstractControl,
    form?: IDynamicForm
  ) {
    const total = (this.total += 1);
    const controlComponentRef = this.service.createComponent(
      this.controlsContainer,
      RepeatableGroupChildComponent
    );
    (state as FormGroup).addControl(
      "formarray_control_index",
      new FormControl(index)
    );
    // Initialize child component input properties
    if (form) {
      controlComponentRef.instance.form = sortformbyindex(copyform(form));
    }
    controlComponentRef.instance.formGroup = state as FormGroup;
    controlComponentRef.instance.index = total;
    controlComponentRef.instance.label = `${this.prefixLabel} ${total}`;
    (controlComponentRef.instance.formGroup as FormGroup).addControl(
      "index",
      new FormControl(controlComponentRef.instance.index)
    );
    controlComponentRef.instance.singleColumnView = this.singleColumnView;
    // Ends child component properties initialization

    controlComponentRef.instance.componentDestroyer
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (this.total > 1) {
          controlComponentRef.destroy();
          this.total -= 1;
          // Remove the elment from the list of reference components
          this.controlsContainerRefs = this.controlsContainerRefs.filter(
            (v: ComponentRef<ChildComponent>) => {
              return v.instance === controlComponentRef.instance ? false : true;
            }
          );
          this.control.removeAt(
            (controlComponentRef.instance.formGroup as FormGroup).getRawValue()
              .formarray_control_index
          );
          this.removedControlGroup.emit({});
        } else {
          controlComponentRef.instance.formGroup.reset();
          this.control.updateValueAndValidity();
        }
      });
    this.controlsContainerRefs.push(controlComponentRef);
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this._destroy$.next();
  }
}
