import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";
import { DynamicForm } from "../dynamic-form";
import { sortDynamicFormByIndex } from "./dynamic-form-helpers";

export const rebuildFormControlConfigs = (
  form: IDynamicForm,
  controlConfigs: Array<IHTMLFormControl>
) => {
  return sortDynamicFormByIndex(
    new DynamicForm({
      id: form.id,
      title: form.title,
      endpointURL: form.endpointURL,
      description: form.description,
      controlConfigs: [...controlConfigs],
      forms: form.forms,
    })
  );
};
