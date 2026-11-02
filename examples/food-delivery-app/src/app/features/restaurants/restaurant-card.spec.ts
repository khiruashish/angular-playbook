import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Restaurant } from '../../core/models/models';
import { RestaurantCard } from './restaurant-card';

const R: Restaurant = {
  id: 'r1', name: 'Spice Route', cuisine: ['North Indian', 'Mughlai'], rating: 4.5,
  deliveryTimeMins: 30, costForTwo: 60000, emoji: '🍛', isOpen: true, isVeg: false,
};

describe('RestaurantCard (component test)', () => {
  let fixture: ComponentFixture<RestaurantCard>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RestaurantCard], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(RestaurantCard);
    fixture.componentRef.setInput('restaurant', R); // signal input
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('renders name, cuisines and cost', () => {
    expect(el.querySelector('h3')?.textContent).toBe('Spice Route');
    expect(el.textContent).toContain('North Indian · Mughlai');
    expect(el.textContent).toContain('₹600.00 for two');
  });

  it('links to the restaurant menu', () => {
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/restaurants/r1');
  });

  it('emits favourite with the id', () => {
    const spy = vi.fn();
    fixture.componentInstance.favourite.subscribe(spy);
    (el.querySelector('.fav') as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalledWith('r1');
  });

  it('shows the closed tag when closed', async () => {
    fixture.componentRef.setInput('restaurant', { ...R, isOpen: false });
    await fixture.whenStable();
    expect(el.textContent).toContain('Closed now');
  });
});
