import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { IDynamicForm, IHTMLFormControl } from '../../../core';
import { DynamicInputTypeHelper } from '../../services';
import { ComponentReactiveFormHelpers } from '../../helpers';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {

  // @Input() parentFormGroup!: FormGroup;
  @Input() control!: AbstractControl & FormGroup;
  @Input() inputConfig!: IHTMLFormControl;
  @Input() showLabelAndDescription = true;
  @Input() parentForm!: IDynamicForm;

  // formGroup!: FormGroup;

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

  constructor(private fb: FormBuilder,
    public readonly inputType: DynamicInputTypeHelper,
    public parentFormGroupDirective: FormGroupDirective) { }

  ngOnInit(): void {
    // console.log(this.form)
    // this.formGroup = this.parentFormGroupDirective.form;

    // this.formGroup.removeControl(this.inputConfig.formControlName);
    // this.formGroup.addControl(
    //   this.inputConfig.formControlName,
    //   ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
    //     this.fb, this.inputConfig.children as IHTMLFormControl[]
    //   ) as FormGroup
    // );

    // console.log(this.control)
    // console.log(this.parentFormGroup)
    // this.parentFormGroup.addControl(this.inputConfig.formControlName, this.formGroup);
    // console.log(this.inputConfig)
    // console.log(this.parentForm.controlConfigs );
    // console.log(this.parentFormGroup)
  }

}
