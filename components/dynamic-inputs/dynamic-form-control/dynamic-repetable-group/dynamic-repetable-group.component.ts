import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentRef, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { IDynamicForm } from '../../core/contracts/dynamic-form';
import { DynamicComponentService } from '../../../services/dynamic-component-resolver.service';
import { RepeatableGroupChildComponent } from './repeatable-group-child/repeatable-group-child.component';
import { isDefined } from '../../../../utils/type-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-repetable-group',
  templateUrl: './dynamic-repetable-group.component.html',
  styles: [
    `
    .clr-offset-margin-right {
      margin-right: -.5rem !important;
    }
    `
  ]
})
export class DynamicRepetableGroupComponent implements OnInit, OnDestroy {

  // Injectable inputs
  @Input() control: FormArray;
  @Input() form: IDynamicForm;
  @Input() addButtonText = 'Plus';
  @Input() hideAddNewFormgroupButton = false;
  @Output() childCreate = new EventEmitter<AbstractControl>();
  @Output() childEdit = new EventEmitter<AbstractControl>();
  @Output() updateParentValueAndValidity = new EventEmitter<object>();
  @Output() removedControlGroup = new EventEmitter<object>();
  @Input() offsetAddNewGroupButton = true;

  // Output event
  @Output() addNewControlGroup: EventEmitter<object> = new EventEmitter();

  private controlsContainerRefs: Array<ComponentRef<RepeatableGroupChildComponent>> = [];
  @ViewChild('controlsContainer', { read: ViewContainerRef, static: true }) controlsContainer: ViewContainerRef;
  private totalAddedComponent = 0;
  private componentDestroyerSubscription: Subscription[] = [];
  public initComponent = new EventEmitter<object>();
  public addNewGroupButtonContainerClass: string;

  constructor(private dynamicComponentLoader: DynamicComponentService<RepeatableGroupChildComponent>) { }

  ngOnInit() {
    this.addNewGroupButtonContainerClass = this.offsetAddNewGroupButton ? 'clr-col-3 clr-offset-2 clr-offset-margin-right' : '';
    // load the dynamic components from the store and create the corresponding components
    if (!isDefined(this.control) || !this.control.controls.length) {
      this.control.controls.forEach((state: FormGroup, index) => {
        this.addChildComponent(index, state);
      });
    }
  }

  collapseChildControlComponents() {
    this.controlsContainerRefs.forEach((ref) => {
      ref.instance.isAccordionOpened = false;
    });
  }

  addChildComponent(controlIndex: number, formGroupState: AbstractControl, showEditButton = false) {
    this.totalAddedComponent += 1;
    // const formgroup = ComponentReactiveFormHelpers
    //   .buildFormGroupFromInputConfig(this.fb, this.form.controlConfigs as IHTMLFormControl[]) as FormGroup;
    const controlComponentRef: ComponentRef<RepeatableGroupChildComponent> = this.dynamicComponentLoader.createComponent(
      this.controlsContainer,
      RepeatableGroupChildComponent
    );
    (formGroupState as FormGroup).addControl('formarray_control_index', new FormControl(controlIndex));
    // Initialize child component input properties
    controlComponentRef.instance.formGroup = formGroupState as FormGroup;
    controlComponentRef.instance.form = Object.assign({}, this.form);
    controlComponentRef.instance.index = (Object.assign({ index: this.totalAddedComponent })).index;
    controlComponentRef.instance.formGroup.addControl('index', new FormControl(controlComponentRef.instance.index));
    controlComponentRef.instance.showEditButton = showEditButton;
    // controlComponentRef.instance.showCreateButton = showCreateButton;
    // Ends child component properties initialization
    controlComponentRef.instance.create.subscribe((state) => this.childCreate.emit(state));
    controlComponentRef.instance.edit.subscribe((state) => this.childEdit.emit(state));
    this.componentDestroyerSubscription.push(controlComponentRef.instance.componentDestroyer.subscribe(
      () => {
        if (this.totalAddedComponent > 1) {
          controlComponentRef.destroy();
          this.totalAddedComponent -= 1;
          // Remove the elment from the list of reference components
          this.controlsContainerRefs = this.controlsContainerRefs.filter(
            (v: ComponentRef<RepeatableGroupChildComponent>) => {
              return v.instance === controlComponentRef.instance ? false : true;
            }
          );
          this.control.removeAt(controlComponentRef.instance.formGroup.getRawValue().formarray_control_index);
          this.removedControlGroup.emit({});
        } else {
          controlComponentRef.instance.formGroup.reset();
          this.control.updateValueAndValidity();
        }
      }
    ));
    this.controlsContainerRefs.push(
      controlComponentRef
    );
  }

  ngOnDestroy() {
    this.componentDestroyerSubscription.forEach((e) => e.unsubscribe());
  }
}
