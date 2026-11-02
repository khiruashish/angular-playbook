import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { APP_ENV } from '../config';
import { environment } from '../../../environments/environment';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let token: string | null;

  beforeEach(() => {
    token = 'abc123';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: APP_ENV, useValue: { ...environment, apiBaseUrl: 'https://api.test' } },
        { provide: AuthService, useValue: { token: () => token } },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('adds the bearer token for our API', () => {
    http.get('https://api.test/orders').subscribe();
    const req = ctrl.expectOne('https://api.test/orders');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush([]);
  });

  it('never sends the token to third-party hosts', () => {
    http.get('https://maps.example.com/geo').subscribe();
    const req = ctrl.expectOne('https://maps.example.com/geo');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('sends no header when logged out', () => {
    token = null;
    http.get('https://api.test/restaurants').subscribe();
    expect(ctrl.expectOne('https://api.test/restaurants').request.headers.has('Authorization')).toBe(false);
  });
});
