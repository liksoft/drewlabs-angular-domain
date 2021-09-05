import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CookieManager {
  // Instance initializer
  constructor(@Inject(DOCUMENT) private document: Document) {}

  setCookie(name: string, value: any, ttl: number): void {
    if (this.document) {
      // Encode value in order to escape semicolons, commas, and whitespace
      var cookie = name + "=" + encodeURIComponent(value);
      if (typeof ttl === "number") {
        /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
        cookie += "; max-age=" + ttl * 24 * 60 * 60;
        this.document.cookie += cookie;
      }
    }
  }

  getCookie(name: string) {
    // Split cookie string and get all individual name=value pairs in an array
    const list = this.document.cookie.split(";");
    // Loop through the array elements
    for (const value of list) {
      const pair = value.split("=");
      if (pair[0] && name == pair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(pair[1]);
      }
    }
    // Return null if not found
    return undefined;
  }
}
