import { InjectionToken } from "@angular/core";
import { IResourcesServerClient } from "../contracts";

export const HTTP_SERVER_RESOURCE_CLIENT = new InjectionToken<IResourcesServerClient<any>>("SERVER RESOURCE CLIENT INSTANCE PROVIDER");
