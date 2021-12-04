import { isPlatformBrowser } from "@angular/common";
import { isDefined } from "../types/type-utils";
import { writeRawStream, writeStream } from "../io";

type WindowEvent = (self: Window, ev?: Event) => any;

/**
 * Provides with promise base file reader functionnality
 * @param file [[File|any]]
 */
export function readFileAsDataURI(file?: File | Blob) {
  return new Promise<string | undefined>((resolve) => {
    if (file) {
      if (isDefined(file)) {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent) => {
          resolve((e.target as any)?.result.toString());
        };
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    }
  });
}

/**
 * @description Convert a base64 encoded string into a [[Blob]] javascript object
 * @param b64Data [[string]] Base64 encoded string
 * @param contentType [[string]]
 * @param sliceSize [[number]] Size of each BlobPart
 */
export function b64toBlob(
  b64Data: string,
  contentType: string,
  sliceSize?: number
) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

/**
 * @deprecated
 */
export class Browser {
  public static print() {
    window.print();
  }

  public static definePrintHandlers(
    callBackBeforePrint: WindowEvent,
    callBackAfterPrint: WindowEvent
  ) {
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia("print");
      // tslint:disable-next-line: deprecation
      mediaQueryList.addListener((mql) => {
        if (mql.matches) {
          callBackBeforePrint(window);
        } else {
          callBackAfterPrint(window);
        }
      });
    }

    window.onbeforeprint = callBackBeforePrint(window);
    window.onafterprint = callBackBeforePrint(window);
  }

  public static scrollTo(element: HTMLElement, to: number, duration: number) {
    if (duration < 0) {
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 2;
    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      this.scrollTo(element, to, duration - 2);
    }, 10);
  }

  static document(platformId: object) {
    return isPlatformBrowser(platformId) ? document : null;
  }

  /**
   * Saves a file by opening file-save-as dialog in the browser
   * using file-save library.
   * @param content file content as a Blob
   * @param name name file should be saved as
   */
  static async saveFile(content: Blob | string, name: string) {
    await writeStream(content, name);
  }

  /**
   * @description Save file as it is, without converting it to a blob content
   * @param content [[Blob|string]]
   * @param name [[string]]
   */
  static saveFileAsRaw(content: Blob | string, name: string) {
    writeRawStream(content, name);
  }
}
