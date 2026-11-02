import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, roleGuard } from './auth.guards';
import { Role } from '../models/models';

describe('auth guards', () => {
  const fakeAuth = { authed: false, roles: [] as Role[] };

  beforeEach(() => {
    fakeAuth.authed = false;
    fakeAuth.roles = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => fakeAuth.authed,
            hasAnyRole: (...r: Role[]) => r.some((x) => fakeAuth.roles.includes(x)),
          },
        },
      ],
    });
  });

  const runAuth = (url: string) =>
    TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
  const runRole = (...roles: Role[]) => TestBed.runInInjectionContext(() => roleGuard(...roles)({} as Route, [], {} as never));
  const serialize = (r: unknown) => TestBed.inject(Router).serializeUrl(r as UrlTree);

  it('authGuard redirects anonymous users to /login with returnUrl', () => {
    expect(serialize(runAuth('/checkout'))).toBe('/login?returnUrl=%2Fcheckout');
  });

  it('authGuard lets authenticated users through', () => {
    fakeAuth.authed = true;
    expect(runAuth('/checkout')).toBe(true);
  });

  it('roleGuard sends users without the role to /forbidden', () => {
    fakeAuth.authed = true;
    fakeAuth.roles = ['CUSTOMER'];
    expect(serialize(runRole('ADMIN'))).toBe('/forbidden');
  });

  it('roleGuard allows ADMIN', () => {
    fakeAuth.authed = true;
    fakeAuth.roles = ['ADMIN'];
    expect(runRole('ADMIN')).toBe(true);
  });
});
