import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { RestaurantApi, RestaurantQuery } from '../../core/api/restaurant-api';
import { Restaurant } from '../../core/models/models';
import { NotificationService } from '../../shared/ui/notification.service';
import { RestaurantCard } from './restaurant-card';

type ViewState = { status: 'loading' } | { status: 'ok'; data: Restaurant[] } | { status: 'error' };

/**
 * Smart (container) component.
 * Signals for local UI state -> RxJS for async orchestration (debounce + switchMap cancels stale calls)
 * -> back to a signal for the template.
 */
@Component({
  selector: 'app-restaurant-list-page',
  imports: [FormsModule, RestaurantCard],
  template: `
    <section class="hero">
      <h1>Hungry? 🍽️</h1>
      <p>Order from the best restaurants near you</p>
      <input class="search" type="search" placeholder="Search restaurants or cuisines…"
             [ngModel]="q()" (ngModelChange)="q.set($event)" aria-label="Search" />
      <div class="filters">
        <label><input type="checkbox" [ngModel]="vegOnly()" (ngModelChange)="vegOnly.set($event)" /> Pure veg</label>
        <select [ngModel]="sort()" (ngModelChange)="sort.set($event)" aria-label="Sort">
          <option value="rating">Top rated</option>
          <option value="deliveryTime">Fastest delivery</option>
          <option value="costLow">Cost: low to high</option>
        </select>
      </div>
    </section>

    @switch (state().status) {
      @case ('loading') {
        <div class="grid">@for (i of skeletons; track i) { <div class="card skeleton"></div> }</div>
      }
      @case ('error') { <p class="err">Could not load restaurants. <button class="btn" (click)="retry()">Retry</button></p> }
      @case ('ok') {
        @let list = data();
        <p class="muted">{{ list.length }} restaurants</p>
        <div class="grid">
          @for (r of list; track r.id) {
            <app-restaurant-card [restaurant]="r" (favourite)="onFavourite($event)" />
          } @empty {
            <p>No restaurants match “{{ q() }}”.</p>
          }
        </div>
      }
    }

    @defer (on viewport) {
      <section class="card promo"><h2>🎉 50% off on your first order</h2><p>Use code <b>WELCOME50</b></p></section>
    } @placeholder {
      <div class="card promo-ph"></div>
    }
  `,
  styles: `
    .hero { text-align: center; padding: 28px 12px; }
    .hero h1 { font-size: 34px; margin: 0; }
    .search { width: min(560px, 100%); padding: 12px 16px; border-radius: 999px; border: 1px solid var(--border); font-size: 16px; }
    .filters { display: flex; gap: 16px; justify-content: center; margin-top: 12px; align-items: center; }
    .grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); perspective: 900px; }
    .skeleton { height: 220px; background: linear-gradient(90deg, #eee, #f7f7f7, #eee); background-size: 200% 100%; animation: sh 1.2s infinite; }
    @keyframes sh { to { background-position: -200% 0; } }
    .promo { margin-top: 24px; background: linear-gradient(135deg, #fb923c, #ef4444); color: #fff; }
    .promo-ph { margin-top: 24px; height: 100px; }
  `,
})
export class RestaurantListPage {
  private readonly api = inject(RestaurantApi);
  private readonly notify = inject(NotificationService);

  protected readonly q = signal('');
  protected readonly vegOnly = signal(false);
  protected readonly sort = signal<NonNullable<RestaurantQuery['sort']>>('rating');
  protected readonly skeletons = [1, 2, 3, 4];
  /** Bumped by "Retry" so an identical query is fetched again. */
  private readonly reloadNonce = signal(0);

  /** Derived query object — recomputed whenever any filter signal changes. */
  private readonly query = computed(() => ({
    nonce: this.reloadNonce(),
    q: this.q().trim(),
    vegOnly: this.vegOnly(),
    sort: this.sort(),
  }));

  protected readonly state = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(({ nonce: _nonce, ...query }) =>
        this.api.search(query).pipe(
          map((data): ViewState => ({ status: 'ok', data })),
          startWith<ViewState>({ status: 'loading' }),
          catchError(() => of<ViewState>({ status: 'error' })),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ViewState },
  );

  protected readonly data = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? s.data : [];
  });

  protected retry(): void {
    this.reloadNonce.update((n) => n + 1);
  }

  onFavourite(id: string): void {
    this.notify.show(`Saved restaurant ${id} to favourites`, 'success');
  }
}
