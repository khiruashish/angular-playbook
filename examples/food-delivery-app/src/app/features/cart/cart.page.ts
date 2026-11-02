import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { CartStore, FREE_DELIVERY_ABOVE } from './cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, InrPipe],
  template: `
    <h1>Your cart</h1>
    @if (cart.isEmpty()) {
      <section class="card empty">
        <p>🛒 Your cart is empty</p>
        <a class="btn primary" routerLink="/">Browse restaurants</a>
      </section>
    } @else {
      <section class="card">
        @for (line of cart.lines(); track line.item.id) {
          <div class="line">
            <span>{{ line.item.name }}</span>
            <span class="stepper">
              <button type="button" (click)="cart.decrement(line.item.id)">−</button>
              {{ line.qty }}
              <button type="button" (click)="cart.add(line.item)">+</button>
            </span>
            <span>{{ line.item.price * line.qty | inr }}</span>
          </div>
        }
        <hr />
        <div class="line"><span>Item total</span><span></span><span>{{ cart.subtotal() | inr }}</span></div>
        <div class="line"><span>Delivery fee</span><span></span><span>{{ cart.deliveryFee() === 0 ? 'FREE' : (cart.deliveryFee() | inr) }}</span></div>
        <div class="line"><span>GST (5%)</span><span></span><span>{{ cart.tax() | inr }}</span></div>
        <div class="line total"><span>To pay</span><span></span><span data-testid="total">{{ cart.total() | inr }}</span></div>
        @if (cart.deliveryFee() > 0) {
          <p class="muted">Add {{ freeAbove - cart.subtotal() | inr }} more for free delivery</p>
        }
        <div class="actions">
          <button class="btn" type="button" (click)="cart.clear()">Clear</button>
          <a class="btn primary" routerLink="/checkout">Proceed to checkout</a>
        </div>
      </section>
    }
  `,
  styles: `
    .line { display: grid; grid-template-columns: 1fr auto 110px; gap: 12px; padding: 6px 0; text-align: right; }
    .line span:first-child { text-align: left; }
    .total { font-weight: 800; font-size: 18px; }
    .stepper button { border: 1px solid var(--border); background: none; border-radius: 6px; width: 26px; cursor: pointer; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }
    .empty { text-align: center; }
  `,
})
export class CartPage {
  protected readonly cart = inject(CartStore);
  protected readonly freeAbove = FREE_DELIVERY_ABOVE;
}
