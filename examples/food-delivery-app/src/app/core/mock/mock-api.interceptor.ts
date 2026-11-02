import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { APP_ENV } from '../config';
import { Order, OrderStatus, PlaceOrderRequest } from '../models/models';
import { MOCK_MENU, MOCK_ORDERS, MOCK_RESTAURANTS, MOCK_USERS } from './mock-data';

const FLOW: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

/**
 * In-browser fake backend so the UI runs with `ng serve` and no server.
 * Enabled only when environment.useMockApi === true (dev). Real envs hit the REST API.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(APP_ENV);
  if (!env.useMockApi || !req.url.startsWith(env.apiBaseUrl)) return next(req);
  const path = req.url.slice(env.apiBaseUrl.length);
  return route(req, path).pipe(delay(250));
};

function ok<T>(body: T, status = 200): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status, body }));
}

function problem(status: number, title: string, detail: string) {
  return throwError(() => new HttpErrorResponse({ status, error: { type: 'about:blank', title, status, detail } }));
}

function route(req: HttpRequest<unknown>, path: string): Observable<HttpResponse<unknown>> {
  const auth = req.headers.get('Authorization');
  let m: RegExpMatchArray | null;

  if (req.method === 'POST' && path === '/auth/login') {
    const { email, password } = req.body as { email: string; password: string };
    const entry = MOCK_USERS[email];
    if (!entry || entry.password !== password) return problem(401, 'Unauthorized', 'Invalid email or password');
    return ok({ accessToken: `mock.${btoa(email)}.sig`, expiresIn: 3600, user: entry.user });
  }

  if (req.method === 'GET' && path === '/restaurants') {
    const q = (req.params.get('q') ?? '').toLowerCase();
    const veg = req.params.get('vegOnly') === 'true';
    const sort = req.params.get('sort');
    let list = MOCK_RESTAURANTS.filter(
      (r) => (!q || r.name.toLowerCase().includes(q) || r.cuisine.some((c) => c.toLowerCase().includes(q))) && (!veg || r.isVeg),
    );
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'deliveryTime') list = [...list].sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
    if (sort === 'costLow') list = [...list].sort((a, b) => a.costForTwo - b.costForTwo);
    return ok(list);
  }

  if (req.method === 'GET' && (m = path.match(/^\/restaurants\/(\w+)\/menu$/))) {
    return ok(MOCK_MENU.filter((i) => i.restaurantId === m![1]));
  }

  if (req.method === 'GET' && (m = path.match(/^\/restaurants\/(\w+)$/))) {
    const r = MOCK_RESTAURANTS.find((x) => x.id === m![1]);
    return r ? ok(r) : problem(404, 'Not Found', `Restaurant ${m[1]} not found`);
  }

  // Everything below requires authentication
  if (path.startsWith('/orders') && !auth) return problem(401, 'Unauthorized', 'Login required');

  if (req.method === 'POST' && path === '/orders') {
    const body = req.body as PlaceOrderRequest;
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === body.restaurantId);
    if (!restaurant?.isOpen) return problem(422, 'Restaurant closed', 'This restaurant is not accepting orders');
    // Server is the source of truth for pricing — same rules as CartStore (fee below ₹499, 5% GST)
    const subtotal = body.lines.reduce((s, l) => s + (MOCK_MENU.find((i) => i.id === l.menuItemId)?.price ?? 0) * l.qty, 0);
    const total = subtotal + (subtotal >= 49900 ? 0 : 3000) + Math.round((subtotal * 500) / 10_000);
    const order: Order = {
      id: `o${MOCK_ORDERS.length + 1001}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      total,
      status: 'PLACED',
      placedAt: new Date().toISOString(),
      etaMins: restaurant.deliveryTimeMins,
    };
    MOCK_ORDERS.unshift(order);
    return ok(order, 201);
  }

  if (req.method === 'GET' && path === '/orders') return ok(MOCK_ORDERS);

  if (req.method === 'GET' && (m = path.match(/^\/orders\/(\w+)$/))) {
    const o = MOCK_ORDERS.find((x) => x.id === m![1]);
    if (!o) return problem(404, 'Not Found', 'Order not found');
    // advance status on every poll to simulate the kitchen + rider
    const i = FLOW.indexOf(o.status);
    if (i >= 0 && i < FLOW.length - 1) o.status = FLOW[i + 1];
    return ok({ ...o });
  }

  if (req.method === 'POST' && (m = path.match(/^\/orders\/(\w+)\/cancel$/))) {
    const o = MOCK_ORDERS.find((x) => x.id === m![1]);
    if (!o) return problem(404, 'Not Found', 'Order not found');
    if (o.status !== 'PLACED') return problem(409, 'Conflict', 'Order can no longer be cancelled');
    o.status = 'CANCELLED';
    return ok({ ...o });
  }

  return problem(404, 'Not Found', `No mock for ${req.method} ${path}`);
}
