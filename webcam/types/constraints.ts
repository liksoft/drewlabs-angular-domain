export type CustomVideoConstraints = {
  width: { exact: number };
  height: { exact: number };
  deviceId?: string;
};

export type VideoConstraints = CustomVideoConstraints | MediaTrackConstraints;
