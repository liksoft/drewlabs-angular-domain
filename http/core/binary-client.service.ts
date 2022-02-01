import { HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { URLUtils } from "../../utils";
import { writeRawStream } from "../../utils/io";
import { BinaryHttpClient as BinaryHttpClientInterface, Client } from "../contracts";
import { HTTP_CLIENT, SERVER_URL } from "../tokens";


const getNameFromResponseHeaders = (res: any) => {
  if (res instanceof Blob) {
    return Math.random().toString(36).substring(2, 15);
  }
  const contentDisposition = res.headers?.get("Content-Disposition") || "";
  const matches = /filename=([^;]+)/gi.exec(contentDisposition) || [];
  return matches?.length === 0 ? undefined : (matches[1] || "untitled").trim();
};

@Injectable()
export class BinaryHttpClient implements BinaryHttpClientInterface {

  constructor(
    @Inject(HTTP_CLIENT) private http: Client,
    @Inject(SERVER_URL) private host: string
  ) { }

  private wrapURL = (path: string) =>
    URLUtils.isWebURL(path) ? `${path}` : `${this.host}${path}`;

  download = (
    url: string,
    name?: string,
    ext?: string,
    params?: { [prop: string]: any }
  ) =>
    this.readBinaryStream(this.wrapURL(url), params).pipe(
      map((response) => {
        name = name || getNameFromResponseHeaders(response) || "unknown";
        return writeRawStream(response, ext ? `${name}.${ext}` : `${name}`);
      })
    );

  readBinaryStream = (url: string, params?: { [prop: string]: any }) =>
    (() => {
      const headers = new HttpHeaders();
      headers.append("Accept", "text/plain");
      headers.append("Content-type", "application/octet-stream");
      return this.http.get(url, { headers, responseType: "blob", params });
    })();
}
