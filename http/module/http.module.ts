import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  DrewlabsRessourceServerClient,
  HttpClient,
  BinaryHttpClient,
} from "../core";
import { parseV2HttpResponse } from "../core/v2/http-response";
import {
  HTTP_BINARY_CLIENT,
  HTTP_CLIENT,
  HTTP_SERVER_RESOURCE_CLIENT,
  SERVER_URL,
} from "../tokens";
import { TransformResponseHandlerFn } from "../contracts";

// tslint:disable-next-line: interface-over-type-literal
type ModuleConfigParams = {
  serverURL: string;
  requestResponseHandler?: TransformResponseHandlerFn;
};

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule],
})
export class HttpModule {
  static forRoot(configs: ModuleConfigParams) {
    return {
      ngModule: HttpModule,
      providers: [
        HttpClient,
        DrewlabsRessourceServerClient,
        BinaryHttpClient,
        {
          provide: SERVER_URL,
          useValue: configs.serverURL,
        },
        {
          provide: HTTP_CLIENT,
          useClass: HttpClient,
        },
        {
          provide: HTTP_SERVER_RESOURCE_CLIENT,
          useClass: DrewlabsRessourceServerClient,
        },
        {
          provide: HTTP_BINARY_CLIENT,
          useClass: BinaryHttpClient,
        },
        {
          provide: "ResponseTransformHandlerFn",
          useValue: configs.requestResponseHandler ?? parseV2HttpResponse,
        },
      ],
    };
  }
}
