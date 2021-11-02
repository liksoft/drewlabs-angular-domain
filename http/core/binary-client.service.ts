import { HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { URLUtils } from "../../utils";
import { writeRawStream } from "../../utils/io";
import {
  BinaryHttpClient as IBinaryHttpClient,
  Client as HttpClient,
} from "../contracts";
import { HTTP_CLIENT, SERVER_URL } from "../tokens";

/**
 * Derives file name from the http response by looking inside content-disposition
 * @param res http Response
 */
const getNameFromResponseHeaders = (res: any) => {
  if (res instanceof Blob) {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  const contentDisposition = res.headers?.get("Content-Disposition") || "";
  const matches = /filename=([^;]+)/gi.exec(contentDisposition) || [];
  const name =
    matches?.length === 0 ? undefined : (matches[1] || "untitled").trim();
  return name;
};

@Injectable()
export class BinaryHttpClient implements IBinaryHttpClient {
  // Instance initializer
  constructor(
    @Inject(HTTP_CLIENT) private http: HttpClient,
    @Inject(SERVER_URL) private host: string
  ) {}
  /**
   * @description provide a file download functionnality to the application
   * @param url
   * @param filename
   * @param extension
   * @param params
   */
  download = (
    url: string,
    name?: string,
    ext?: string,
    params?: { [prop: string]: any }
  ) =>
    this.readBinaryStream(
      URLUtils.isWebURL(url) ? `${url}` : `${this.host}${url}`,
      params
    ).pipe(
      map((response) => {
        name = name || getNameFromResponseHeaders(response) || "unknown";
        return writeRawStream(response, ext ? `${name}.${ext}` : `${name}`);
      })
    );

  /**
   * Read the HTTP response as a binary stream {@see Blob}
   *
   * @param url
   * @param params
   * @returns
   */
  readBinaryStream = (url: string, params?: { [prop: string]: any }) =>
    (() => {
      const headers = new HttpHeaders();
      headers.append("Accept", "text/plain");
      headers.append("Content-type", "application/octet-stream");
      return this.http.get(url, { headers, responseType: "blob", params });
    })();
}
