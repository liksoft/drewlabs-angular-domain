import { FormsProvider } from "../../core";

export const initializeDynamicFormContainer = (
  service: FormsProvider,
  assetsURL: string
) => {
  return async () => {
    console.log(service);
    return await service
      .cache(assetsURL || "/assets/resources/app-forms.json")
      .toPromise();
  };
};
