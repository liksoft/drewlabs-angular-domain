import { HttpClient } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { BinaryHttpClient, Client, ErrorHandler } from "../contracts";

export const HTTP_CLIENT = new InjectionToken<(Client | HttpClient) & ErrorHandler>("HTTP CLIENT INSTANCE PROVIDER");

export const SERVER_URL = new InjectionToken<string>("WEB SERVICE HOST URL PROVIDER");

export const HTTP_BINARY_CLIENT = new InjectionToken<BinaryHttpClient>("HTTP BINARY CLIENT INSTANCE PROVIDER");
