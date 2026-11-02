import { Signal, computed, signal } from '@angular/core';

/** Challenge 5: reusable client-side pagination built from signals. */
export function paginate<T>(items: Signal<T[]>, pageSize = 5) {
  const page = signal(1);
  const totalPages = computed(() => Math.max(1, Math.ceil(items().length / pageSize)));
  const current = computed(() => Math.min(page(), totalPages()));
  const pageItems = computed(() => items().slice((current() - 1) * pageSize, current() * pageSize));
  return {
    page: current,
    totalPages,
    pageItems,
    hasNext: computed(() => current() < totalPages()),
    hasPrev: computed(() => current() > 1),
    next: () => page.set(Math.min(current() + 1, totalPages())),
    prev: () => page.set(Math.max(current() - 1, 1)),
    goTo: (p: number) => page.set(Math.min(Math.max(1, p), totalPages())),
  };
}
