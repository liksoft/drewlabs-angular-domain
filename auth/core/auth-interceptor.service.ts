import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService } from '../../auth-token/core/auth-token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private tokenService: AuthTokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      // Get the auByteString
      let token: string = this.tokenService.token;
      if (token) {
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        token = null;
        return next.handle(authReq);
      }
      return next.handle(req);
    }
}
