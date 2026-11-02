import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, distinctUntilChanged, map, switchMap, takeWhile, timer } from 'rxjs';
import { APP_ENV } from '../config';
import { Order, PlaceOrderRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_ENV).apiBaseUrl}/orders`;

  place(req: PlaceOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, req);
  }

  myOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  get(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  /** Polls every `everyMs` until the order is terminal (in prod prefer SSE/WebSocket). */
  track(id: string, everyMs = 3000): Observable<Order> {
    return timer(0, everyMs).pipe(
      switchMap(() => this.get(id)),
      distinctUntilChanged((a, b) => a.status === b.status),
      takeWhile((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED', true),
    );
  }

  cancel(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.base}/${id}/cancel`, {}).pipe(map((o) => o));
  }
}
