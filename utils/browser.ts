import { isPlatformBrowser } from '@angular/common';
import { isDefined } from './type-utils';

type WindowEvent = (self: Window, ev?: Event) => any;

export function readFileAsDataURI(file: File) {
  return new Promise((_, __) => {
    if (isDefined(file)) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent) => {
        _((e.target as FileReader).result.toString());
      };
      reader.readAsDataURL(file);
    } else {
      _(null);
    }
  });
}
export class Browser {
  public static print() {
    window.print();
  }

  public static definePrintHandlers(
    callBackBeforePrint: WindowEvent,
    callBackAfterPrint: WindowEvent
  ) {
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      // tslint:disable-next-line: deprecation
      mediaQueryList.addListener(mql => {
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
    setTimeout(function () {
      element.scrollTop = element.scrollTop + perTick;
      this.scrollTo(element, to, duration - 2);
    }, 10);
  }

  static document(platformId: object) {
    return isPlatformBrowser(platformId) ? document : null;
  }
}
