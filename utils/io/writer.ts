import { Base64 } from "./base64";
import { saveAs } from "file-saver";

/**
 * Saves a file by opening file-save-as dialog in the browser
 *
 * using file-save library.
 */
export const writeStream = async (
  content: Blob | string | ArrayBuffer,
  name: string,
  type: string | undefined = "application/octet-stream"
) => {
  const blob =
    content instanceof Blob
      ? content
      : typeof content === "string"
      ? (
          await Base64.fromString(content, type ?? "application/octet-stream")
        ).toBlob(type)
      : new Blob([new Uint8Array(content)]);
  saveAs(blob, name);
};

/**
 * @description Save file as it is, without converting it to a blob content
 *
 * using file-save library.
 */
export const writeRawStream = (
  blobContent: Blob | string,
  fileName: string
) => {
  saveAs(blobContent, fileName);
};
