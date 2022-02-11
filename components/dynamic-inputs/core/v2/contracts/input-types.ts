import { IHTMLFormControl } from "../../contracts";

type MultiControlItem = { id: string; label: string; template?: string };

type ServerSideControlItemConfig = {
  collection: string;
  columns?: string[];
  model?: string;
};

/**
 * @description Type definition for a control item that provide a select or combobox
 * view
 */
export interface SelectableControl extends IHTMLFormControl {
  items: MultiControlItem[];
  optionsLabel?: string;
  optionsValue?: string | number;
  multiple?: boolean;
  groupKey?: string;
}

/**
 * @description Type definition for an control element that load items from a remote
 * server instead of the hardcoded items
 */
export interface ServerSideSelectableControl extends SelectableControl {
  serverCollectionConfigs: ServerSideControlItemConfig;
}

export enum SelectableControlDataSource {
  MODEL = 2,
  LIST = 1,
}
