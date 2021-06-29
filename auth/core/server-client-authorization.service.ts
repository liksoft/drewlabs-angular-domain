import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionStorage } from "../../storage/core";

export type XAuthClient = {
    clientID?: string,
    clientSecret?: string
};

@Injectable({
    providedIn: 'root'
})
export class XclientAuthStorageService {

    public constructor(private _storage: SessionStorage) { }

    public getXAuthClient() {
        return this._storage.get('X_AUTHORIZATION_CLIENT') as XAuthClient;
    }

    public setXAuthClient(client: XAuthClient) {
        this._storage.set('X_AUTHORIZATION_CLIENT', client);
    }
}

@Injectable()
export class XClientAuthorizationHeadersInterceptor implements HttpInterceptor {
    constructor(private _provider: XclientAuthStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const client = this._provider.getXAuthClient();
        if (client) {
            // Clone the request and replace the original headers with
            // cloned headers, updated with the authorization.
            req = req.clone({
                headers: req.headers.set('X-AUTHORIZATION-CLIENT-ID', `${client?.clientID}`)
                    .set('X-AUTHORIZATION-CLIENT-TOKEN', `${client?.clientSecret}`)
            });
        }
        return next.handle(req);
    }
}