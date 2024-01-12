import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IDynamicForm, IHTMLFormControl } from '../../../core';
import { ComponentReactiveFormHelpers } from '../../helpers';
import { DynamicInputTypeHelper } from '../../services';

@Component({
  selector: 'app-dynamic-repetable-group-v2',
  templateUrl: './dynamic-repetable-group-v2.component.html',
})
export class DynamicRepetableGroupV2Component implements OnInit {

  @Input() control!: FormArray;
  @Input() inputConfig!: IHTMLFormControl;
  @Input() showLabelAndDescription = true;
  @Input() parentForm!: IDynamicForm;

  @Output() change = new EventEmitter<any>();

  get formArray() {
    return this.control as FormArray;
  }

  get form() {
    return { id: 0, controlConfigs: this.inputConfig.children } || {} as IDynamicForm
  }

  get formGroup() {
    return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.fb, this.inputConfig.children as IHTMLFormControl[]
    ) as FormGroup;
  }

  get parentFormGroup() {
    return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
      this.fb, this.parentForm.controlConfigs as IHTMLFormControl[]
    ) as FormGroup;
  }

  constructor(public readonly inputType: DynamicInputTypeHelper, private fb: FormBuilder) { }

  ngOnInit(): void {
    for (let i = 0; i < this.getFormArrayLenght(); i++) {      
      this.formArray.push(this.formGroup);
    }
  }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  /**
   * add a new row to formArray
   */
  add() {
    this.formArray.push(this.formGroup)
  }

  /**
   * remove a row
   * @param i 
   */
  remove(i: number) {
    this.formArray.removeAt(i);
  }

  getErrors(): {index: string, value: any}[] {
    const errorsObj = this.formArray.errors ?? {};
    let errors = Object.keys(errorsObj)
    .map(key => ({index: key, value: errorsObj[key]}))
    .filter(value => value.index.startsWith('custom'));
    return errors;
  }


  getFormArrayLenght(): number {
    return this.inputConfig?.childrenParams?.length ?? 0;
  }

}