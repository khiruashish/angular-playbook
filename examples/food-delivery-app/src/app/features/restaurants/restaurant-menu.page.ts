import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantApi } from '../../core/api/restaurant-api';
import { MenuItem } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { NotificationService } from '../../shared/ui/notification.service';
import { RatingBadge } from '../../shared/ui/rating-badge';
import { CartStore } from '../cart/cart.store';

/**
 * Route: /restaurants/:id — `id` arrives as a signal input thanks to withComponentInputBinding().
 * Data comes from httpResource(): no subscribe, no unsubscribe, auto-refetch when id changes.
 */
@Component({
  selector: 'app-restaurant-menu-page',
  imports: [InrPipe, RatingBadge, RouterLink],
  template: `
    @if (restaurant.hasValue()) {
      @let r = restaurant.value();
      <header class="card head">
        <span class="emoji">{{ r.emoji }}</span>
        <div>
          <h1>{{ r.name }}</h1>
          <p class="muted">{{ r.cuisine.join(', ') }} · {{ r.deliveryTimeMins }} min</p>
        </div>
        <app-rating-badge [rating]="r.rating" />
      </header>
    } @else if (restaurant.error()) {
      <p class="err">Restaurant not found. <a routerLink="/">Back to list</a></p>
    }

    @if (menu.isLoading()) {
      <p class="muted">Loading menu…</p>
    }

    @for (group of grouped(); track group.category) {
      <h2>{{ group.category }} <small class="muted">({{ group.items.length }})</small></h2>
      <ul class="menu">
        @for (item of group.items; track item.id) {
          <li class="card item">
            <div>
              <span class="dot" [class.veg]="item.isVeg" [attr.aria-label]="item.isVeg ? 'veg' : 'non-veg'"></span>
              @if (item.bestseller) { <span class="tag">★ Bestseller</span> }
              <h3>{{ item.name }}</h3>
              <p class="muted">{{ item.description }}</p>
              <b>{{ item.price | inr }}</b>
            </div>
            @if (cart.qtyOf(item.id); as qty) {
              <div class="stepper">
                <button type="button" (click)="cart.decrement(item.id)" aria-label="Remove one">−</button>
                <span data-testid="qty">{{ qty }}</span>
                <button type="button" (click)="add(item)" aria-label="Add one">+</button>
              </div>
            } @else {
              <button class="btn primary" type="button" (click)="add(item)">ADD</button>
            }
          </li>
        }
      </ul>
    }

    @if (!cart.isEmpty()) {
      <a class="cart-bar" routerLink="/cart">{{ cart.count() }} items · {{ cart.subtotal() | inr }} — View cart →</a>
    }
  `,
  styles: `
    .head { display: flex; align-items: center; gap: 16px; }
    .head h1 { margin: 0; }
    .emoji { font-size: 56px; }
    .menu { list-style: none; padding: 0; display: grid; gap: 12px; }
    .item { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .item h3 { margin: 4px 0; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: #b91c1c; margin-right: 6px; }
    .dot.veg { background: #15803d; }
    .stepper { display: flex; align-items: center; gap: 10px; border: 1px solid var(--brand); border-radius: 8px; padding: 4px 8px; }
    .stepper button { border: 0; background: none; font-size: 20px; color: var(--brand); cursor: pointer; }
    .cart-bar { position: sticky; bottom: 12px; display: block; text-align: center; background: var(--brand); color: #fff; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 700; box-shadow: var(--shadow-lg); }
  `,
})
export class RestaurantMenuPage {
  private readonly api = inject(RestaurantApi);
  private readonly notify = inject(NotificationService);
  protected readonly cart = inject(CartStore);

  readonly id = input.required<string>();

  protected readonly restaurant = this.api.restaurantResource(this.id);
  protected readonly menu = this.api.menuResource(this.id);

  protected readonly grouped = computed(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const item of this.menu.value()) {
      groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
    }
    return [...groups].map(([category, items]) => ({ category, items }));
  });

  add(item: MenuItem): void {
    if (!this.cart.add(item)) {
      this.notify.show('Your cart has items from another restaurant. Clear it first.', 'error');
    }
  }
}
