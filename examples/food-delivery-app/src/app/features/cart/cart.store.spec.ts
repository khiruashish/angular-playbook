import { TestBed } from '@angular/core/testing';
import { MenuItem } from '../../core/models/models';
import { CartStore, DELIVERY_FEE } from './cart.store';

const item = (id: string, price: number, restaurantId = 'r1'): MenuItem => ({
  id, restaurantId, price, name: id, description: '', isVeg: true, category: 'x',
});

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
  });

  it('starts empty', () => {
    expect(store.isEmpty()).toBe(true);
    expect(store.total()).toBe(0);
  });

  it('adds items and increments quantity for the same item', () => {
    store.add(item('a', 10000));
    store.add(item('a', 10000));
    store.add(item('b', 5000));
    expect(store.count()).toBe(3);
    expect(store.subtotal()).toBe(25000);
    expect(store.qtyOf('a')).toBe(2);
  });

  it('charges delivery below the free threshold and adds 5% GST', () => {
    store.add(item('a', 20000)); // ₹200
    expect(store.deliveryFee()).toBe(DELIVERY_FEE);
    expect(store.tax()).toBe(1000); // 5% of 20000
    expect(store.total()).toBe(20000 + DELIVERY_FEE + 1000);
  });

  it('gives free delivery at or above ₹499', () => {
    store.add(item('a', 49900));
    expect(store.deliveryFee()).toBe(0);
  });

  it('rejects items from a different restaurant', () => {
    expect(store.add(item('a', 100, 'r1'))).toBe(true);
    expect(store.add(item('b', 100, 'r2'))).toBe(false);
    expect(store.count()).toBe(1);
  });

  it('decrement removes the line when qty reaches zero', () => {
    store.add(item('a', 100));
    store.decrement('a');
    expect(store.isEmpty()).toBe(true);
  });

  it('persists to localStorage via effect', () => {
    store.add(item('a', 100));
    TestBed.tick(); // flush effects
    expect(JSON.parse(localStorage.getItem('fd.cart')!)).toHaveLength(1);
  });
});
