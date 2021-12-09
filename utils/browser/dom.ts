import { JSObject } from "../types";

type OnScriptLoadFn = () => void;

export type LoadLibraryOptions = {
  scriptURL: string;
  onLibraryLoadFn?: OnScriptLoadFn;
};

export class DOM {

  /**
   * Provides an implementation for dynamically loading Javascript scripts at runtime
   *
   * @param document
   * @param options
   */
  public static loadJSLib = (
    document: Document,
    options: LoadLibraryOptions
  ) => {
    // TODO : Provides a default implementation for the onLibraryLoadFn function
    const defaultLoadFn: OnScriptLoadFn = () => {};
    // Get the Window default view
    let { defaultView } = document;
    if (defaultView) {
      defaultView = JSObject.setProperty(defaultView, "Module", { ...options });
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.setAttribute("type", "text/javascript");
      script.addEventListener("load", options.onLibraryLoadFn ?? defaultLoadFn);
      script.addEventListener("error", () => {
        throw new Error(`Failed to load ${options.scriptURL}`);
      });
      script.src = options.scriptURL;
      const node = document.getElementsByTagName("script")[0];
      if (node) {
        node.parentNode?.insertBefore(script, node);
      } else {
        document.head.appendChild(script);
      }
    }
  };
}
