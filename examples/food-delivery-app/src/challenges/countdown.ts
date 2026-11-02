import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';

/** Challenge 4: countdown timer that cleans up after itself (no leaks), zoneless-friendly. */
@Component({
  selector: 'app-countdown',
  template: `<span role="timer">{{ label() }}</span>`,
})
export class Countdown {
  readonly seconds = input(10);
  protected readonly elapsed = signal(0);
  readonly remaining = computed(() => Math.max(0, this.seconds() - this.elapsed()));
  protected readonly label = computed(() => {
    const r = this.remaining();
    return r === 0 ? 'Time up!' : `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`;
  });

  constructor() {
    const id = setInterval(() => {
      this.elapsed.update((e) => e + 1);
      if (this.remaining() === 0) clearInterval(id);
    }, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
