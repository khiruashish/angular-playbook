import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderApi } from '../../core/api/order-api';
import { Order, OrderStatus } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { Feedback, OrderFeedback } from './order-feedback';
import { OrderStatusPipe } from './order-status.pipe';
import { NotificationService } from '../../shared/ui/notification.service';

const STEPS: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

@Component({
  selector: 'app-order-tracking-page',
  imports: [InrPipe, OrderStatusPipe, OrderFeedback],
  template: `
    @if (order(); as o) {
      <section class="card">
        <h1>Order #{{ o.id }}</h1>
        <p>{{ o.restaurantName }} · {{ o.total | inr }} · ETA {{ o.etaMins }} min</p>
        <ol class="timeline">
          @for (s of steps; track s; let i = $index) {
            <li [class.done]="i <= progress()" [class.current]="i === progress()">{{ s | orderStatus }}</li>
          }
        </ol>
        @if (o.status === 'PLACED') {
          <button class="btn" type="button" (click)="cancel(o.id)">Cancel order</button>
        }
        @if (o.status === 'CANCELLED') { <p class="err">This order was cancelled.</p> }
        @if (o.status === 'DELIVERED') {
          @defer (on viewport) { <app-order-feedback (sent)="onFeedback($event)" /> } @placeholder { <div style="height: 200px"></div> }
        }
      </section>
    } @else {
      <p class="muted">Loading order…</p>
    }
  `,
  styles: `
    .timeline { list-style: none; padding: 0; border-left: 3px solid var(--border); margin-left: 8px; }
    .timeline li { padding: 8px 16px; position: relative; color: var(--muted); }
    .timeline li::before { content: ''; position: absolute; left: -9px; top: 12px; width: 14px; height: 14px; border-radius: 50%; background: var(--border); }
    .timeline li.done { color: inherit; }
    .timeline li.done::before { background: var(--brand); }
    .timeline li.current { font-weight: 700; }
  `,
})
export class OrderTrackingPage implements OnInit {
  private readonly api = inject(OrderApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input.required<string>();
  protected readonly order = signal<Order | null>(null);
  protected readonly steps = STEPS;
  protected readonly progress = computed(() => STEPS.indexOf(this.order()?.status ?? 'PLACED'));

  ngOnInit(): void {
    // input() values are available from ngOnInit onwards
    this.api
      .track(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((o) => this.order.set(o));
  }

  private readonly notify = inject(NotificationService);

  onFeedback(f: Feedback): void {
    this.notify.show(`Thanks for rating ${f.rating}★`, 'success');
  }

  cancel(id: string): void {
    this.api.cancel(id).subscribe((o) => this.order.set(o));
  }
}
