import { Component, computed, signal } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}
type Filter = 'all' | 'active' | 'done';

/** Challenge 3: Todo list with signals: add, toggle, remove, filter, counts. */
@Component({
  selector: 'app-todo-list',
  template: `
    <form (submit)="$event.preventDefault(); add(title.value); title.value = ''">
      <input #title placeholder="What needs doing?" aria-label="New todo" />
      <button type="submit">Add</button>
    </form>
    <nav>
      @for (f of filters; track f) {
        <button type="button" [class.active]="filter() === f" (click)="filter.set(f)">{{ f }}</button>
      }
    </nav>
    <ul>
      @for (t of visible(); track t.id) {
        <li [class.done]="t.done">
          <input type="checkbox" [checked]="t.done" (change)="toggle(t.id)" [attr.aria-label]="t.title" />
          {{ t.title }}
          <button type="button" (click)="remove(t.id)" aria-label="Remove">✕</button>
        </li>
      } @empty {
        <li class="empty">Nothing here</li>
      }
    </ul>
    <p class="summary">{{ remaining() }} left · {{ todos().length }} total</p>
  `,
})
export class TodoList {
  protected readonly filters: Filter[] = ['all', 'active', 'done'];
  private nextId = 1;
  readonly todos = signal<Todo[]>([]);
  readonly filter = signal<Filter>('all');
  readonly remaining = computed(() => this.todos().filter((t) => !t.done).length);
  readonly visible = computed(() => {
    const f = this.filter();
    return this.todos().filter((t) => f === 'all' || (f === 'done' ? t.done : !t.done));
  });

  add(title: string): void {
    const t = title.trim();
    if (t) this.todos.update((list) => [...list, { id: this.nextId++, title: t, done: false }]);
  }
  toggle(id: number): void {
    this.todos.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  remove(id: number): void {
    this.todos.update((list) => list.filter((t) => t.id !== id));
  }
}
