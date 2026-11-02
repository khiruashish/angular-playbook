import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { APP_ENV } from '../core/config';
import { HasRoleDirective } from '../shared/directives/has-role.directive';
import { CartStore } from '../features/cart/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  template: `
    <header class="bar">
      <a class="logo" routerLink="/">🍔 FoodDash</a>
      @if (env.name !== 'prod') { <span class="env">{{ env.name }}</span> }
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Restaurants</a>
        @if (auth.isAuthenticated()) {
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          <a *appHasRole="['ADMIN']" routerLink="/admin" routerLinkActive="active">Admin</a>
        }
        <a routerLink="/cart" routerLinkActive="active" class="cart">Cart <b>{{ cart.count() }}</b></a>
        @if (auth.user(); as u) {
          <span class="muted">Hi, {{ u.name.split(' ')[0] }}</span>
          <button class="btn" type="button" (click)="auth.logout()">Logout</button>
        } @else {
          <a class="btn primary" routerLink="/login">Login</a>
        }
      </nav>
    </header>
  `,
  styles: `
    .bar { display: flex; align-items: center; gap: 12px; padding: 12px 20px; background: var(--surface); box-shadow: var(--shadow); position: sticky; top: 0; z-index: 10; flex-wrap: wrap; }
    .logo { font-weight: 900; font-size: 22px; color: var(--brand); text-decoration: none; }
    .env { background: #fde68a; border-radius: 6px; padding: 2px 8px; font-size: 12px; text-transform: uppercase; font-weight: 700; }
    nav { margin-left: auto; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
    nav a { color: inherit; text-decoration: none; }
    nav a.active { color: var(--brand); font-weight: 700; }
    .cart b { background: var(--brand); color: #fff; border-radius: 999px; padding: 0 7px; }
  `,
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartStore);
  protected readonly env = inject(APP_ENV);
}
