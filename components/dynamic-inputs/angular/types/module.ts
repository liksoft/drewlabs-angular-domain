export type ModuleConfigs = {
  serverConfigs: {
    host?: string;
    controlOptionsPath?: string;
    controlsPath?: string;
    formsPath?: string;
    controlBindingsPath?: string;
  };
  formsAssets?: string;
  clientFactory?: Function;
};
