import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { APP_ENV } from '../config';
import { LoginResponse, Role, User } from '../models/models';

interface Session {
  token: string;
  expiresAt: number;
  user: User;
}

const STORAGE_KEY = 'fd.session';

/**
 * Holds the authenticated session as signals.
 * NOTE: for production prefer the BFF pattern (httpOnly, SameSite cookies) or an OIDC
 * library with PKCE — sessionStorage is used here to keep the example self-contained.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly env = inject(APP_ENV);

  private readonly session = signal<Session | null>(this.restore());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const s = this.session();
    return !!s && s.expiresAt > Date.now();
  });
  readonly roles = computed<Role[]>(() => this.user()?.roles ?? []);

  token(): string | null {
    return this.isAuthenticated() ? this.session()!.token : null;
  }

  hasAnyRole(...roles: Role[]): boolean {
    return roles.some((r) => this.roles().includes(r));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.env.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) =>
          this.setSession({
            token: res.accessToken,
            expiresAt: Date.now() + res.expiresIn * 1000,
            user: res.user,
          }),
        ),
      );
  }

  logout(redirect = true): void {
    this.setSession(null);
    if (redirect) void this.router.navigate(['/login']);
  }

  private setSession(s: Session | null): void {
    this.session.set(s);
    try {
      if (s) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable (private mode / SSR) — keep in memory only */
    }
  }

  private restore(): Session | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
