import { Inject, Injectable } from "@angular/core";
import { BinaryHttpClient, HTTP_BINARY_CLIENT } from "../http";
import { readFileAsDataURI, b64toBlob } from "../utils/browser";
import { writeRawStream } from "../utils/io";

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

export interface ServerFileInterface extends IFileRessource {
  id: number | string;
}

export interface UploadedFileHelperInterface {
  /**
   * @description Load file from the server and convert it to a dataURI
   * @param url [[string]]
   */
  loadFileAsDataURI(url: string): Promise<string | undefined>;

  /**
   * @description Download contents from a url and return a fileStats
   * @param url [[string]]
   * @param filename [[string]]
   */
  // tslint:disable-next-line: typedef
  urlToFileFileRessource(
    url: string,
    filename: string,
    shouldDownload?: boolean,
    extension?: string
  ): Promise<IFileRessource | undefined | null>;

  /**
   * @description Use Browser API for saving a base64 string as a blob file
   * @param ressource [[string]]
   * @param filename [[string]]
   */
  // tslint:disable-next-line: typedef
  saveDataURLAsBlob(ressource: string, filename: string): Promise<null | void>;

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
  providedIn: "root",
})
export class FileHelperService implements UploadedFileHelperInterface {
  /**
   * @description Instance constructor
   */
  constructor(@Inject(HTTP_BINARY_CLIENT) private client: BinaryHttpClient) {}

  /**
   * @inheritdoc
   */
  loadFileAsDataURI = async (url: string) => {
    return readFileAsDataURI(
      (await this.client.readBinaryStream(url).toPromise()) as Blob
    );
  };

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  async urlToFileFileRessource(
    url: string,
    filename: string,
    download: boolean = false,
    ext?: string
  ) {
    const v = await this.loadFileAsDataURI(url);
    if (v) {
      const block = v.split(";");
      // Get the content type of the image
      const contentType = block[0].split(":")[1];
      return {
        name: filename,
        content: v,
        type: contentType,
        showldownload: download,
        ext,
      } as IFileRessource;
    }
    return undefined;
  }
  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  async urlToServerFileInterface(
    url: string,
    {
      id,
      name,
      shouldDownload,
      extension,
    }: Partial<{
      id: number | string;
      name: string;
      shouldDownload: boolean;
      extension: string;
    }>
  ) {
    const v = await this.loadFileAsDataURI(url);
    if (v) {
      const block = v.split(";");
      // Get the content type of the image
      const contentType = block[0].split(":")[1];
      return {
        id,
        name,
        content: v,
        type: contentType,
        showldownload: shouldDownload,
        extension,
      } as ServerFileInterface;
    }
    return null;
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  async saveDataURLAsBlob(
    ressource: string,
    filename: string,
    extension?: string
  ) {
    const blocks = ressource.split(";");
    // Get the content type of the image
    const contentType = blocks[0].split(":")[1];
    // get the real base64 content of the file
    const data = blocks[1].split(",")[1];
    return writeRawStream(
      b64toBlob(data, contentType),
      extension ? `${filename}.${extension}` : filename
    );
  }

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: typedef
  downloadFile(
    url: string,
    filename: string,
    extension?: string,
    params?: { [prop: string]: any }
  ) {
    return this.client.download(url, filename, extension, params).toPromise();
  }
}
