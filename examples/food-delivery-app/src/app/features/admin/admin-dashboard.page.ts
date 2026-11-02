import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderApi } from '../../core/api/order-api';
import { RestaurantApi } from '../../core/api/restaurant-api';
import { AuthService } from '../../core/auth/auth.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';

/** Lazy-loaded, protected by roleGuard('ADMIN') via canMatch. */
@Component({
  selector: 'app-admin-dashboard-page',
  imports: [InrPipe],
  template: `
    <h1>Admin dashboard</h1>
    <p class="muted">Signed in as {{ auth.user()?.name }} ({{ auth.roles().join(', ') }})</p>
    <div class="kpis">
      <div class="card kpi"><span>Restaurants</span><b>{{ restaurants().length }}</b></div>
      <div class="card kpi"><span>Open now</span><b>{{ openCount() }}</b></div>
      <div class="card kpi"><span>Orders</span><b>{{ orders().length }}</b></div>
      <div class="card kpi"><span>GMV</span><b>{{ gmv() | inr }}</b></div>
    </div>
  `,
  styles: `
    .kpis { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); perspective: 800px; }
    .kpi { display: grid; gap: 6px; transform: rotateX(6deg); transition: transform .2s; }
    .kpi:hover { transform: rotateX(0) translateY(-4px); }
    .kpi b { font-size: 28px; }
  `,
})
export class AdminDashboardPage {
  protected readonly auth = inject(AuthService);
  protected readonly restaurants = toSignal(inject(RestaurantApi).search({}), { initialValue: [] });
  protected readonly orders = toSignal(inject(OrderApi).myOrders(), { initialValue: [] });
  protected readonly openCount = computed(() => this.restaurants().filter((r) => r.isOpen).length);
  protected readonly gmv = computed(() => this.orders().reduce((s, o) => s + o.total, 0));
}
