import { Injectable, OnDestroy } from '@angular/core';
import { readFileAsDataURI, Browser, b64toBlob } from '../utils/browser';
import { HttpRequestService } from '../http/core/http-request.service';

/**
 * @description Type definition for a file ressource object
 */
export interface IFileRessource {
  name: string;
  content: string;
  extension?: string;
  type?: string;
  showldownload?: boolean;
}

@Injectable()
export class FileHelperService implements OnDestroy {

  /**
   * @description Instance constructor
   */
  constructor(private client: HttpRequestService) {
  }

  /**
   * @description Load file from the server and convert it to a dataURI
   * @param url [[string]]
   */
  async loadFileAsDataURI(url: string): Promise<string> {
    return readFileAsDataURI(await this.client.loadServerFile(url) as Blob);
  }

  /**
   * @description Download contents from a url and return a fileStats
   * @param url [[string]]
   * @param filename [[string]]
   */
  async urlToFileFileRessource(url: string, filename: string, shouldDownload: boolean = false, extension?: string) {
    const v = await this.loadFileAsDataURI(url);
    if (v) {
      const block = v.split(';');
      // Get the content type of the image
      const contentType = block[0].split(':')[1];
      return {
        name: filename,
        content: v,
        type: contentType,
        showldownload: shouldDownload,
        extension
      } as IFileRessource;
    }
    return null;
  }

  /**
   * @description Use Browser API for saving a base64 string as a blob file
   * @param ressource [[string]]
   * @param filename [[string]]
   */
  async saveDataURLAsBlob(ressource: string, filename: string) {
    const blocks = ressource.split(';');
    // Get the content type of the image
    const contentType = blocks[0].split(':')[1];
    // get the real base64 content of the file
    const data = blocks[1].split(',')[1];
    Browser.saveFile(b64toBlob(data, contentType), filename);
  }

  /**
   * @Description Provide file download from backend server
   * @param url [[string]]
   * @param filename [[string]]
   * @param extension [[string]]
   */
  downloadFile(url: string, filename: string, extension: string = null) {
    return this.client.downloadFile(url, filename, extension);
  }

  ngOnDestroy() { }
}
