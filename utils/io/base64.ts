import { after } from "../types";
import { readAsDataURL } from "./reader";

export class DataURIEncoded {
  // DataURIEncoded object inializer
  protected constructor(
    private content: string,
    private contentType: string = "",
    private sliceSize: number = 512
  ) {}

  /**
   * Convert the base64 object to {@link Blob} instance
   *
   * @param contentType
   * @param sliceSize
   */
  toBlob(contentType?: string, sliceSize?: number) {
    contentType = contentType || this.contentType || "";
    sliceSize = sliceSize || this.sliceSize || 512;

    const byteCharacters = atob(this.content);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  }

  static async fromBlob(
    content: Blob,
    contentType: string | undefined = undefined
  ) {
    try {
      const _content = (await readAsDataURL(content)) as string;
      return DataURIEncoded.fromString(
        after("base64,", _content),
        contentType ?? content?.type
      );
    } catch (error) {
      throw new Error(error as string);
    }
  }

  static async fromString(
    content: string,
    contentType: string = "",
    sliceSize: number = 512
  ) {
    return new DataURIEncoded(content, contentType, sliceSize);
  }

  // Convert the data uri encoded object to string
  toString = () =>
    this.content?.startsWith("data:")
      ? this.content
      : `data:${
          this.contentType && this.contentType !== ""
            ? this.contentType.endsWith(";")
              ? this.contentType.substring(0, this.contentType?.length - 1)
              : this.contentType
            : "application/octet-stream"
        };base64,${this.content}`;
}

export class Base64 extends DataURIEncoded {}
