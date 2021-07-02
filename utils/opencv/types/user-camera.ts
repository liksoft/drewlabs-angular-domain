export type OnStartUserCameraHandlerFn = (source: any, dest: any) => void

export type VideoConstraints = { [index: string]: { width: { exact: number }, height: { exact: number } } };