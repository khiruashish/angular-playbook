import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderApi } from '../../core/api/order-api';
import { PlaceOrderRequest } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { NotificationService } from '../../shared/ui/notification.service';
import { CartStore } from '../cart/cart.store';
import { pincodeValidator } from './pincode.validator';

@Component({
  selector: 'app-checkout-page',
  imports: [ReactiveFormsModule, InrPipe],
  template: `
    <h1>Checkout</h1>
    <form class="card" [formGroup]="form" (ngSubmit)="placeOrder()">
      <fieldset formGroupName="address">
        <legend>Delivery address</legend>
        <label>Address line <input formControlName="line1" /></label>
        <label>City <input formControlName="city" /></label>
        <label>PIN code <input formControlName="pincode" inputmode="numeric" maxlength="6" /></label>
        @if (form.controls.address.controls.pincode.hasError('pincode')) {
          <small class="err">PIN code must be 6 digits</small>
        }
      </fieldset>
      <fieldset>
        <legend>Payment</legend>
        @for (m of methods; track m) {
          <label class="radio"><input type="radio" formControlName="paymentMethod" [value]="m" /> {{ m }}</label>
        }
      </fieldset>
      <button class="btn primary big" type="submit" [disabled]="form.invalid || placing() || cart.isEmpty()">
        {{ placing() ? 'Placing order…' : 'Pay ' + (cart.total() | inr) }}
      </button>
    </form>
  `,
  styles: `
    form { display: grid; gap: 16px; max-width: 560px; }
    fieldset { border: 1px solid var(--border); border-radius: 10px; display: grid; gap: 10px; }
    label { display: grid; gap: 4px; }
    .radio { display: flex; gap: 8px; }
    .big { padding: 14px; font-size: 16px; }
  `,
})
export class CheckoutPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly orders = inject(OrderApi);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  protected readonly cart = inject(CartStore);

  protected readonly methods = ['UPI', 'CARD', 'COD'] as const;
  protected readonly placing = signal(false);

  /** Strictly typed: form.getRawValue() is { address: {...}, paymentMethod: 'UPI'|'CARD'|'COD' } */
  protected readonly form = this.fb.group({
    address: this.fb.group({
      line1: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, pincodeValidator]],
    }),
    paymentMethod: this.fb.control<PlaceOrderRequest['paymentMethod']>('UPI', Validators.required),
  });

  /** Used by the unsavedChangesGuard (canDeactivate). */
  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.placing();
  }

  placeOrder(): void {
    const rid = this.cart.restaurantId();
    if (this.form.invalid || !rid) return;
    const { address, paymentMethod } = this.form.getRawValue();
    const req: PlaceOrderRequest = {
      restaurantId: rid,
      lines: this.cart.lines().map((l) => ({ menuItemId: l.item.id, qty: l.qty })),
      address,
      paymentMethod,
    };
    this.placing.set(true);
    this.orders
      .place(req)
      .pipe(finalize(() => this.placing.set(false)))
      .subscribe((order) => {
        this.cart.clear();
        this.form.markAsPristine();
        this.notify.show(`Order ${order.id} placed!`, 'success');
        void this.router.navigate(['/orders', order.id]);
      });
  }
}
