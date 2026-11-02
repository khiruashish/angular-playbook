import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { OrderApi } from '../../core/api/order-api';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { OrderStatusPipe } from './order-status.pipe';

@Component({
  selector: 'app-orders-page',
  imports: [RouterLink, InrPipe, DatePipe, OrderStatusPipe],
  template: `
    <h1>My orders</h1>
    @for (o of orders(); track o.id) {
      <a class="card order" [routerLink]="['/orders', o.id]">
        <b>#{{ o.id }} · {{ o.restaurantName }}</b>
        <span>{{ o.status | orderStatus }}</span>
        <span class="muted">{{ o.placedAt | date: 'medium' }}</span>
        <b>{{ o.total | inr }}</b>
      </a>
    } @empty {
      <p class="muted">No orders yet.</p>
    }
  `,
  styles: `.order { display: grid; grid-template-columns: 2fr 2fr 2fr 1fr; gap: 8px; margin-bottom: 10px; color: inherit; text-decoration: none; }`,
})
export class OrdersPage {
  protected readonly orders = toSignal(inject(OrderApi).myOrders(), { initialValue: [] });
}
