import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { takeUntil, tap } from "rxjs/operators";
import { createSubject } from "../../rxjs/helpers";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor, OnDestroy {
  // Service destroy handler
  private _destroy$ = createSubject<void>();
  // Authenticated user token
  private token: string | undefined;

  /// Service instance initializer
  constructor(auth: AuthService) {
    // Sourscrire sur le service de gestion du token d'authentification
    //  et assigner à la propriété privé _token the la classe la valeur
    // récupérée depuis le service de gestion de token
    auth.state$
      .pipe(
        // Souscrire jusqu'a ce que le service ne soit détruit
        takeUntil(this._destroy$),
        tap((state) => {
          if (state.token) {
            this.token = state.token;
          }
        })
      )
      .subscribe();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Vérifier si la valeur du token est pas défini
    // Si la valeur du token d'authentification est défini
    // Modifier la requête en passant l'entête d'authorization
    // récupéré depuis le service de gestion des token
    if (this.token) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${this.token}`),
      });
    }
    // Retrourner la prochaine exécution de la pile des middlewares
    return next.handle(req);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
