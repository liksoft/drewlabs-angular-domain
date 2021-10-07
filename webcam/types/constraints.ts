export type VideoConstraints =
  | {
      width: { exact: number };
      height: { exact: number };
    }
  | MediaStreamConstraints;
