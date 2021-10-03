import { Inject, Injectable, Optional } from "@angular/core";
import { WINDOW } from "../ng/common";

@Injectable({
  providedIn: "root",
})
export class WindowRef {
  get nativeWindow() {
    return this.window;
  }

  constructor(@Inject(WINDOW) @Optional() private window: Window) {}
}

@Injectable({
  providedIn: "root",
})
export class Dialog {
  constructor(@Inject(WINDOW) @Optional() private window: Window) {}

  /**
   * @description Prompt application user for an action
   * @param message [[string]] prompt text
   */
  public prompt(message: string): string | null {
    return this.window?.prompt(message);
  }

  /**
   * @description Request an action confirmation from user
   * @param message [[string]]
   */
  public confirm(message: string): boolean {
    return this.window?.confirm(message);
  }
}
