import { Control } from "./form-control";
import {
  OptionInterface,
  ControlInterface,
  FormInterface,
} from "../../compact/types";
import {
  GenericSerializaleSerializer,
  UndecoratedSerializer,
} from "../../../../../built-value/core/js/serializer";

export class Form implements FormInterface {
  id!: number;
  title!: string;
  parentId!: string;
  description!: string;
  /**
   * @deprecated
   */
  children!: FormInterface[];
  controls: ControlInterface[] = [];
  url!: string;
  status!: number;
  appcontext!: string;

  static builder = () => {
    return new GenericSerializaleSerializer(Form, new UndecoratedSerializer());
  };

  public static getJsonableProperties(): {
    [index: string]: keyof Form | { name: string; type: any };
  } {
    return {
      title: "title",
      parentId: "parentId",
      description: "description",
      children: { name: "children", type: Form },
      controls: { name: "controls", type: Control },
      url: "url",
      status: "status",
      id: "id",
      appcontext: "appcontext",
    };
  }
}

export class Option implements OptionInterface {
  id!: number;
  table!: string;
  keyfield!: string;
  groupfield!: string;
  description!: string;
  displayLabel!: string;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder() {
    return new GenericSerializaleSerializer<OptionInterface>(
      Option,
      new UndecoratedSerializer()
    );
  }

  static getJsonableProperties():
    | { [index: string]: keyof Option }
    | { [index: string]: { name: string; type: any } } {
    return {
      id: "id",
      table: "table",
      keyfield: "keyfield",
      groupfield: "groupfield",
      valuefield: "description",
      display_label: "displayLabel",
    };
  }
}

export function createFormElement(value: { [index: string]: any }) {
  return Form.builder().fromSerialized(value) as FormInterface;
}

export function createOptionElement(value: { [index: string]: any }) {
  return Option.builder().fromSerialized(value) as OptionInterface;
}

export function serializedOptionElement(value: OptionInterface) {
  return Option.builder().toSerialized(value);
}
