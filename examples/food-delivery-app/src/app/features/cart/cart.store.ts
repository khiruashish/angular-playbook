import { Injectable, computed, effect, signal } from '@angular/core';
import { CartLine, MenuItem, Paise } from '../../core/models/models';

const KEY = 'fd.cart';
export const DELIVERY_FEE: Paise = 3000; // ₹30
export const FREE_DELIVERY_ABOVE: Paise = 49900; // ₹499
export const GST_RATE_BPS = 500; // 5% in basis points

/**
 * Signal-based store (no library). State is private & writable; the public API is
 * read-only computed signals + intention-revealing methods.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _lines = signal<CartLine[]>(this.load());

  readonly lines = this._lines.asReadonly();
  readonly restaurantId = computed(() => this._lines()[0]?.item.restaurantId ?? null);
  readonly count = computed(() => this._lines().reduce((n, l) => n + l.qty, 0));
  readonly subtotal = computed<Paise>(() => this._lines().reduce((s, l) => s + l.item.price * l.qty, 0));
  readonly deliveryFee = computed<Paise>(() =>
    this.subtotal() === 0 || this.subtotal() >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE,
  );
  readonly tax = computed<Paise>(() => Math.round((this.subtotal() * GST_RATE_BPS) / 10_000));
  readonly total = computed<Paise>(() => this.subtotal() + this.deliveryFee() + this.tax());
  readonly isEmpty = computed(() => this._lines().length === 0);

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this._lines()));
      } catch {
        /* ignore */
      }
    });
  }

  /** Returns false when the item belongs to a different restaurant (single-restaurant cart rule). */
  add(item: MenuItem): boolean {
    const rid = this.restaurantId();
    if (rid && rid !== item.restaurantId) return false;
    this._lines.update((lines) => {
      const existing = lines.find((l) => l.item.id === item.id);
      return existing
        ? lines.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...lines, { item, qty: 1 }];
    });
    return true;
  }

  decrement(itemId: string): void {
    this._lines.update((lines) =>
      lines.flatMap((l) => (l.item.id !== itemId ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])),
    );
  }

  qtyOf(itemId: string): number {
    return this._lines().find((l) => l.item.id === itemId)?.qty ?? 0;
  }

  clear(): void {
    this._lines.set([]);
  }

  private load(): CartLine[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartLine[];
    } catch {
      return [];
    }
  }
}
