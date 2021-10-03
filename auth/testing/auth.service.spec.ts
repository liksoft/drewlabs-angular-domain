import { TestBed } from '@angular/core/testing';
import { AuthTokenService, AuthRememberTokenService } from '../../auth-token/core';
import { SpyObj } from '../../testing';
import { UserStorageProvider } from '../core/services/user-storage';
import { authenticatedResponse, unauthenticatedResponse } from '../testing';
import { AuthService } from '../core/auth.service';
import { IAppUser, AppUser } from '../contracts/v2/user/user';
import { SessionStorage } from '../../storage/core/session-storage.service';
import { GenericUndecoratedSerializaleSerializer } from '../../built-value/core/js/serializer';
import { ILoginResponse } from '../contracts/v2/login.response';
import { Router } from '@angular/router';
import { HttpClientStub } from '../../testing/http-client';
import { InMemoryStoreService } from '../../storage/core';
import { filter } from 'rxjs/operators';
import { isDefined } from '../../utils/types';
import { drewlabsIsAuthenticationSuccessful } from '../rxjs/operators';
import { HTTP_CLIENT } from '../../http/contracts';

const testSetup = () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']) as SpyObj<Router>;
  const httpClientServiceSpy = new HttpClientStub();
  const rememberTokenProviderSpy = jasmine.createSpyObj('UserStorageProvider', ['setToken']) as SpyObj<AuthRememberTokenService>;
  rememberTokenProviderSpy.setToken.and.returnValue(null);

  TestBed.configureTestingModule({
    providers: [
      { provide: HTTP_CLIENT, useValue: httpClientServiceSpy },
      AuthTokenService,
      UserStorageProvider,
      {
        provide: SessionStorage,
        useClass: InMemoryStoreService
      },
      { provide: AuthRememberTokenService, useValue: rememberTokenProviderSpy },
      { provide: Router, useValue: routerSpy },
      AuthService,
      { provide: 'APP_SECRET', useValue: 'Secret' },
      {
        provide: 'USER_SERIALIZER',
        useValue: (new GenericUndecoratedSerializaleSerializer<AppUser>())
      },
      {
        provide: 'DREWLABS_USER_TOKEN_KEY',
        useValue: 'X_Auth_Token'
      },
    ],
  });

  return { httpClientServiceSpy, rememberTokenProviderSpy };
};

describe('Authentication Service provider tests', () => {
  it('should call authenticate method and return an ILoginResponse object', () => {
    // Arrange
    let { httpClientServiceSpy } = testSetup();
    httpClientServiceSpy = httpClientServiceSpy.setReturnValue(authenticatedResponse);
    // Act
    const authProvider = TestBed.inject<AuthService>(AuthService);
    const result$ = authProvider.authenticate({ username: 'Drewlabs', password: 'HomeStead' });

    // Assert
    result$.subscribe((source: ILoginResponse) => {
      expect(drewlabsIsAuthenticationSuccessful(source)).toBe(true);
    });
  });

  it('should update authservice state to authenticated state', (done: DoneFn) => {
    // Arrange
    let { httpClientServiceSpy } = testSetup();
    httpClientServiceSpy = httpClientServiceSpy.setReturnValue(authenticatedResponse);

    // Act
    const authProvider = TestBed.inject<AuthService>(AuthService);
    authProvider.state$
      .pipe(
        filter(state => !state.authenticating && isDefined(state.isInitialState))
      ).subscribe(state => {
        expect(state.isLoggedIn).toBe(true);
        expect((state.user as IAppUser).id).toBe(29);
        done();
      });
    const result$ = authProvider.authenticate({ username: 'Drewlabs', password: 'HomeStead' });
    // Assert
    result$.subscribe();
  });

  it('should update authservice state with isLoggedIn equals to false', (done: DoneFn) => {
    // Arrange
    let { httpClientServiceSpy } = testSetup();
    httpClientServiceSpy = httpClientServiceSpy.setReturnValue(unauthenticatedResponse);

    // Act
    const authProvider = TestBed.inject<AuthService>(AuthService);
    authProvider.state$
      .pipe(
        filter(state => !state.authenticating && isDefined(state.isInitialState))
      ).subscribe(state => {
        expect(state.isLoggedIn).toBe(false);
        done();
      });
    const result$ = authProvider.authenticate({ username: 'Drewlabs', password: 'HomeStead' });
    // Assert
    result$.subscribe();
  });

  it('should fails authentication with an HttpErrorResponse', (done: DoneFn) => {
    // Arrange
    let { httpClientServiceSpy } = testSetup();
    httpClientServiceSpy = httpClientServiceSpy.setReturnValue('error');
    // Act
    const authProvider = TestBed.inject<AuthService>(AuthService);
    const result$ = authProvider.authenticate({ username: 'Drewlabs', password: 'HomeStead' });
    done();
  });
});
