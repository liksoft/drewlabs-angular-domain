import { Injectable } from '@angular/core';

class WrapperUtils {
  public static getWindow() {
    return window;
  }
}

@Injectable()
export class WindowRef {

  get nativeWindow() {
    return WrapperUtils.getWindow();
  }
}

@Injectable()
export class Dialog {

  /**
   * @param windowRef [[WindowRef]] Reference to the window object
   */
  constructor(private windowRef: WindowRef) { }

  /**
   * @description Prompt application user for an action
   * @param message [[string]] prompt text
   */
  public prompt(message: string): string {
    return this.windowRef.nativeWindow.prompt(message);
  }

  /**
   * @description Request an action confirmation from user
   * @param message [[string]]
   */
  public confirm(message: string): boolean {
    return this.windowRef.nativeWindow.confirm(message);
  }
}
