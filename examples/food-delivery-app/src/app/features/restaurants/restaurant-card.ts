import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { RatingBadge } from '../../shared/ui/rating-badge';

/** Presentational ("dumb") component: inputs in, outputs out, no services. */
@Component({
  selector: 'app-restaurant-card',
  imports: [RouterLink, InrPipe, RatingBadge],
  template: `
    <a class="card r-card" [class.closed]="!restaurant().isOpen" [routerLink]="['/restaurants', restaurant().id]">
      <div class="cover" aria-hidden="true">{{ restaurant().emoji }}</div>
      <div class="body">
        <div class="row">
          <h3>{{ restaurant().name }}</h3>
          <app-rating-badge [rating]="restaurant().rating" />
        </div>
        <p class="muted">{{ restaurant().cuisine.join(' · ') }}</p>
        <p class="muted">{{ restaurant().deliveryTimeMins }} min · {{ restaurant().costForTwo | inr }} for two</p>
        @if (!restaurant().isOpen) { <span class="tag">Closed now</span> }
        @if (restaurant().isVeg) { <span class="tag veg">Pure veg</span> }
      </div>
    </a>
    <button class="fav" type="button" (click)="favourite.emit(restaurant().id)" aria-label="Add to favourites">♡</button>
  `,
  styles: `
    :host { position: relative; display: block; }
    .r-card { display: block; padding: 0; overflow: hidden; color: inherit; text-decoration: none; transition: transform .2s, box-shadow .2s; }
    .r-card:hover { transform: translateY(-4px) rotateX(2deg); box-shadow: var(--shadow-lg); }
    .closed { filter: grayscale(.8); }
    .cover { font-size: 64px; text-align: center; padding: 18px; background: linear-gradient(135deg, #ffedd5, #fecaca); }
    .body { padding: 12px 14px; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    h3 { margin: 0; font-size: 17px; }
    p { margin: 4px 0; }
    .fav { position: absolute; top: 8px; right: 8px; border: 0; background: #fff; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; }
  `,
})
export class RestaurantCard {
  readonly restaurant = input.required<Restaurant>();
  readonly favourite = output<string>();
}
