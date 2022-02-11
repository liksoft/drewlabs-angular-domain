import { DropzoneConfig } from "../../../dropzone";

type FormApiServerConfigs = {
  host?: string;
  optionsPath?: string;
  controlsPath?: string;
  formsPath?: string;
  bindingsPath?: string;
};

export type ModuleConfigs = {
  dropzoneConfigs?: DropzoneConfig;
  serverConfigs: FormApiServerConfigs;
  formsAssets?: string;
  clientFactory?: Function;
};
