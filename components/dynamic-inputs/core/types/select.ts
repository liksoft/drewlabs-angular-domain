import { BindingControlInterface, InputInterface } from './input';

type MultiControlItem = { id: string; label: string; template?: string };

type ServerSideControlItemConfig = {
  collection: string;
  columns?: string[];
  model?: string;
};

// @internal
export interface SelectableControl extends InputInterface, BindingControlInterface {
  optionsLabel?: string;
  optionsValue?: string | number;
  multiple?: boolean;
  groupKey?: string;
}

// @internal
export interface ServerSideSelectableControl extends SelectableControl {
  serverCollectionConfigs: ServerSideControlItemConfig;
}

export enum SelectableControlDataSource {
  MODEL = 2,
  LIST = 1,
}
