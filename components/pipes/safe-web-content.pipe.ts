import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// use better logic for every content load
class LoadJSURL {
  // tslint:disable-next-line: variable-name
  private _url: string;
  /**
   *
   */
  constructor(url: string) {
    this._url = url;
  }

  private canJsLoad(url: string) {
      if (!url) {
        return false;
      }
      const scripts = document.getElementsByTagName('script');
      for (let i = scripts.length; i--;) {
          if (scripts[i].src === url) {
            return false;
          }
      }
      return true;
  }

  private insertJsUrl(url: string) {
      const script = document.createElement('script');
      script.setAttribute('src', url);
      document.body.appendChild(script);
  }

  insertUrl() {
    if (this.canJsLoad(this._url)) {
      this.insertJsUrl(this._url);
    }
  }
}

@Pipe({
  name: 'safeWebContent'
})
export class SafeWebContentPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }
  transform(value: string) {
      return this.sanitized.bypassSecurityTrustHtml(value);
  }

}

@Pipe({
  name: 'safeRessourceContent'
})
export class SafeRessourceContentPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }
  transform(value: string) {
      return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}

@Pipe({name: 'checkScripts'})
export class CheckScriptsPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(value: string) {
        const jsUrls = value.match(/(\/\/.+\..+\/.+\.js)/g);

        if (jsUrls && jsUrls.length) {
            for (const url of jsUrls) {
                new LoadJSURL(url).insertUrl();
            }
        }
        return value;
    }
}

