export type OpenCVLoadResult =  {
    ready: boolean,
    hasError: boolean,
    loading: boolean
}
export type OpenCVOptions = {
    scriptUrl: string,
    onRuntimeInitialized: OpenCVRuntimeInitializedFn
}

export type OpenCVRuntimeInitializedFn = () => void;

export type Point = {
    x: number,
    y: number,
    dx: number,
    dy: number
};
