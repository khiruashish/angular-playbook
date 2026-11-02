import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LoginResponse, Restaurant } from '../models/models';
import { mockApiInterceptor } from './mock-api.interceptor';

describe('mockApiInterceptor (fake backend contract)', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([mockApiInterceptor]))] });
    http = TestBed.inject(HttpClient);
  });

  it('filters veg restaurants and sorts by rating', async () => {
    const list = await firstValueFrom(http.get<Restaurant[]>('/api/restaurants', { params: { vegOnly: true, sort: 'rating' } }));
    expect(list.every((r) => r.isVeg)).toBe(true);
    expect(list.map((r) => r.rating)).toEqual([...list.map((r) => r.rating)].sort((a, b) => b - a));
  });

  it('logs in a demo user', async () => {
    const res = await firstValueFrom(http.post<LoginResponse>('/api/auth/login', { email: 'admin@food.dev', password: 'password' }));
    expect(res.user.roles).toContain('ADMIN');
  });

  it('returns a ProblemDetail 401 for bad credentials', async () => {
    const err = await firstValueFrom(http.post('/api/auth/login', { email: 'x', password: 'y' })).catch((e: HttpErrorResponse) => e);
    expect((err as HttpErrorResponse).status).toBe(401);
    expect((err as HttpErrorResponse).error.detail).toBe('Invalid email or password');
  });
});
