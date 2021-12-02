import { Injectable } from "@angular/core";
import { AbstractControl, FormBuilder } from "@angular/forms";
import { isArray } from "../../../../utils";
import { IDynamicForm, IHTMLFormControl } from "../../core";
import { AngularReactiveFormBuilderBridge } from "../contracts";
import { ComponentReactiveFormHelpers } from "../helpers";

@Injectable()
export class ReactiveFormBuilderBrige
  implements AngularReactiveFormBuilderBridge
{
  // Creates and instance of the Angular reactive form bridge
  constructor(public readonly builder: FormBuilder) {}

  group(source: IDynamicForm | IHTMLFormControl[]): AbstractControl {
    if (source) {
      const source_ = !isArray(source)
        ? [...((source as IDynamicForm).controlConfigs as IHTMLFormControl[])]
        : (source as IHTMLFormControl[]);
      return ComponentReactiveFormHelpers.buildFormGroupFromInputConfig(
        this.builder,
        source_
      );
    }
    return this.builder.group({});
  }
}
