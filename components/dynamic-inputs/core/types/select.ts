import { ControlInterface } from "../compact/types";
import { IHTMLFormControl, IHTMLFormControlValidationRule } from "../contracts";
import { BindingControlInterface } from "../contracts/dynamic-input";
import { buildRequiredIfConfig } from "../helpers/builders";
import { controlBindingsSetter } from "../helpers/control-bindings";
import { parseControlItemsConfigs } from "../helpers/parsers";
import { AbstractHTMLFormControl } from "./dynamic-input";

/**
 * @description Selectable options control configuration definition class
 */
export class SelectInput
  extends AbstractHTMLFormControl
  implements Partial<BindingControlInterface>
{
  items: any[];
  optionsLabel?: string;
  optionsValueIndex?: string | number;
  multiple?: boolean;
  groupByKey?: string;

  // Added properties for loading data remotely
  serverBindings?: string;
  clientBindings?: string;
  groupfield: string;
  valuefield: string;
  keyfield: string;

  /**
   * @description Instance initializer
   * @param value Required input configuration object
   */
  constructor(value: SelectInput) {
    super(value);
    this.items = value.items ?? [];
    this.optionsLabel = value.optionsLabel;
    this.optionsValueIndex = value.optionsValueIndex;
    this.multiple = value.multiple ? value.multiple : false;
    this.groupByKey = value.groupByKey;
    this.serverBindings = value.serverBindings;
    this.clientBindings = value.clientBindings;
    this.groupfield = value.groupfield ?? "id";
    this.valuefield = value.valuefield ?? "label";
    this.keyfield = value.keyfield ?? "id";
  }

  /**
   * Build a dynamic HTMLFormControl from a form control model
   * @param model [[FormControlModel]]
   */
  static fromFormControlModel(
    model: Partial<ControlInterface>
  ): IHTMLFormControl {
    // Parse the model fields
    let { keyfield, valuefield, groupfield } = model.selectableModel
      ? parseControlItemsConfigs(model)
      : model;
    keyfield = model.keyfield || keyfield;
    valuefield = model.valuefield || valuefield;
    groupfield = model.groupfield || groupfield;
    // ! End Parse model fields
    return new SelectInput(
      controlBindingsSetter<SelectInput>(model.options || [])({
        ...{ keyfield, valuefield, groupfield },
        label: model.label,
        type: model.type,
        formControlName: model.controlName,
        value: model.value,
        classes: model.classes,
        uniqueCondition: model.uniqueOn,
        isRepeatable: Boolean(model.isRepeatable),
        containerClass: model.dynamicControlContainerClass,
        requiredIf: model.requiredIf
          ? buildRequiredIfConfig(model.requiredIf)
          : undefined,
        formControlIndex: model.controlIndex,
        formControlGroupKey: model.controlGroupKey,
        rules: {
          isRequired: Boolean(model.required),
        } as IHTMLFormControlValidationRule,
        placeholder: model.placeholder,
        disabled: Boolean(model.disabled),
        readOnly: Boolean(model.readonly),
        descriptionText: model.description,
        optionsLabel: "description",
        groupByKey: "type",
        optionsValueIndex: "id",
        multiple: Boolean(model.multiple),
        serverBindings: model.selectableModel,
        clientBindings: model.selectableValues,
      } as SelectInput)
    );
  }
}
