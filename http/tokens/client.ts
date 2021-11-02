import { HttpClient } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { BinaryHttpClient, Client, ErrorHandler } from "../contracts";

export const HTTP_CLIENT = new InjectionToken<
  (Client | HttpClient) & ErrorHandler
>("HTTP Client instance provider");

export const SERVER_URL = new InjectionToken<string>("Host URL");

export const HTTP_BINARY_CLIENT = new InjectionToken<BinaryHttpClient>(
  "HTTP Binary client instance provider"
);
