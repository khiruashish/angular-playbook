import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating-badge',
  template: `<span class="badge" [class.low]="isLow()">★ {{ rating().toFixed(1) }}</span>`,
  styles: `
    .badge { background: #1a7f37; color: #fff; border-radius: 6px; padding: 2px 6px; font-weight: 600; font-size: 12px; }
    .low { background: #d97706; }
  `,
})
export class RatingBadge {
  readonly rating = input.required<number>();
  protected readonly isLow = computed(() => this.rating() < 3.5);
}
