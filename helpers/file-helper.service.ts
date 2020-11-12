import { Injectable } from '@angular/core';
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

  // Conditional properties definitions
  showldownload?: boolean;
  isImageRessource?: boolean;
  isVideoRessource?: boolean;
}

export interface UploadedFileHelperInterface
{
  /**
   * @description Load file from the server and convert it to a dataURI
   * @param url [[string]]
   */
  loadFileAsDataURI(url: string): Promise<string>;

  /**
   * @description Download contents from a url and return a fileStats
   * @param url [[string]]
   * @param filename [[string]]
   */
  // tslint:disable-next-line: typedef
  urlToFileFileRessource(url: string, filename: string, shouldDownload?: boolean, extension?: string): Promise<IFileRessource>;

  /**
   * @description Use Browser API for saving a base64 string as a blob file
   * @param ressource [[string]]
   * @param filename [[string]]
   */
  // tslint:disable-next-line: typedef
  saveDataURLAsBlob(ressource: string, filename: string): Promise<null|void>;

  /**
   * @Description Provide file download from backend server
   * @param url [[string]]
   * @param filename [[string]]
   * @param extension [[string]]
   */
  // tslint:disable-next-line: typedef
  downloadFile(url: string, filename: string, extension?: string): Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class FileHelperService implements UploadedFileHelperInterface {

  /**
   * @description Instance constructor
   */
  constructor(private client: HttpRequestService) { }

  /**
   * @inheritdoc
   */
  async loadFileAsDataURI(url: string): Promise<string> {
    return readFileAsDataURI(await this.client.loadServerFile(url) as Blob);
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  async urlToFileFileRessource(
    url: string, filename: string,
    shouldDownload: boolean = false,
    extension?: string
  ) {
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
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  async saveDataURLAsBlob(ressource: string, filename: string) {
    const blocks = ressource.split(';');
    // Get the content type of the image
    const contentType = blocks[0].split(':')[1];
    // get the real base64 content of the file
    const data = blocks[1].split(',')[1];
    Browser.saveFile(b64toBlob(data, contentType), filename);
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  downloadFile(url: string, filename: string, extension: string = null, params?: { [prop: string]: any }) {
    return this.client.downloadFile(url, filename, extension, params);
  }
}
