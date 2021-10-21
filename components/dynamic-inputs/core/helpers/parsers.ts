import { ControlInterface } from "../compact/types";

export const parseControlItemsConfigs = (
  model: Partial<ControlInterface>
) => {
  const items = model.selectableModel?.split("|") || [];
  let keyfield: string | undefined;
  let groupfield: string | undefined;
  let valuefield: string | undefined;

  items.forEach((key) => {
    if (key.match(/keyfield:/)) {
      keyfield = key.replace("keyfield:", "");
    }
    if (key.match(/groupfield:/)) {
      groupfield = key.replace("groupfield:", "");
    }
    if (key.match(/valuefield:/)) {
      valuefield = key.replace("valuefield:", "");
    }
  });
  return { keyfield, valuefield, groupfield };
};
