import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_ENV } from '../config';
import { MenuItem, Restaurant } from '../models/models';

export interface RestaurantQuery {
  q?: string;
  vegOnly?: boolean;
  sort?: 'rating' | 'deliveryTime' | 'costLow';
}

/** Thin data-access layer: one place that knows URLs. Components never build URLs. */
@Injectable({ providedIn: 'root' })
export class RestaurantApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_ENV).apiBaseUrl}/restaurants`;

  /** Classic Observable style — GET /restaurants?q=&vegOnly=&sort= */
  search(query: RestaurantQuery): Observable<Restaurant[]> {
    let params = new HttpParams();
    if (query.q) params = params.set('q', query.q);
    if (query.vegOnly) params = params.set('vegOnly', true);
    if (query.sort) params = params.set('sort', query.sort);
    return this.http.get<Restaurant[]>(this.base, { params });
  }

  /** Signal style (httpResource) — re-fetches automatically whenever `id()` changes. */
  restaurantResource(id: Signal<string>) {
    return httpResource<Restaurant>(() => `${this.base}/${id()}`);
  }

  menuResource(id: Signal<string>) {
    return httpResource<MenuItem[]>(() => `${this.base}/${id()}/menu`, { defaultValue: [] });
  }
}
