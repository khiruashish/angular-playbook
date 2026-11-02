import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guards';
import { unsavedChangesGuard } from './features/checkout/unsaved-changes.guard';
import { RestaurantListPage } from './features/restaurants/restaurant-list.page';
import { ForbiddenPage, NotFoundPage } from './layout/status-pages';

export const routes: Routes = [
  // Eager: the landing page is in the initial bundle
  { path: '', component: RestaurantListPage, title: 'FoodDash — Order food online' },

  // Lazy standalone components (each becomes its own JS chunk)
  { path: 'login', loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage), title: 'Sign in' },
  {
    path: 'restaurants/:id',
    loadComponent: () => import('./features/restaurants/restaurant-menu.page').then((m) => m.RestaurantMenuPage),
    title: 'Menu',
  },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage), title: 'Cart' },
  {
    path: 'checkout',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage),
    title: 'Checkout',
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/orders/orders.page').then((m) => m.OrdersPage), title: 'My orders' },
      {
        path: ':id',
        loadComponent: () => import('./features/orders/order-tracking.page').then((m) => m.OrderTrackingPage),
        title: 'Track order',
      },
    ],
  },
  // Lazy child routes, guarded by role — canMatch means non-admins never even download the chunk
  { path: 'admin', canMatch: [roleGuard('ADMIN')], loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES) },

  { path: 'forbidden', component: ForbiddenPage, title: 'Forbidden' },
  { path: '**', component: NotFoundPage, title: 'Not found' },
];
