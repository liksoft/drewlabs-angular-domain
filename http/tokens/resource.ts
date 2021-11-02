import { InjectionToken } from "@angular/core";
import { IResourcesServerClient } from "../contracts";

/**
 * @description Server resource client provider
 */
export const HTTP_SERVER_RESOURCE_CLIENT = new InjectionToken<
  IResourcesServerClient<any>
>("Server Resource Client provider");
