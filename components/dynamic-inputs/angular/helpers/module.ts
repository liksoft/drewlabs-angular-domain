import { CacheProvider } from "../../core";

export const initializeDynamicFormContainer = (
  service: CacheProvider,
  assetsURL: string
) => {
  return async () => {
    return await service
      .cache(assetsURL || "/assets/resources/app-forms.json")
      .toPromise();
  };
};
