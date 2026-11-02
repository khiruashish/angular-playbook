import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError, delay } from 'rxjs';
import { Countdown } from './countdown';
import { paginate } from './paginate';
import { RepeatDirective } from './repeat.directive';
import { TodoList } from './todo-list';
import { TruncatePipe } from './truncate.pipe';
import { typeahead } from './typeahead';

describe('Challenge 1: TruncatePipe', () => {
  const p = new TruncatePipe();
  it('cuts at a word boundary', () => expect(p.transform('Butter chicken with garlic naan', 18)).toBe('Butter chicken…'));
  it('leaves short text alone', () => expect(p.transform('Dosa', 10)).toBe('Dosa'));
  it('hard-cuts a single long word', () => expect(p.transform('Supercalifragilistic', 5)).toBe('Super…'));
});

@Component({
  imports: [RepeatDirective],
  template: `<ul><li *appRepeat="n(); let i">Item {{ i }}</li></ul>`,
})
class RepeatHost {
  n = signal(3);
}

describe('Challenge 2: *appRepeat', () => {
  it('renders N items and reacts to changes', async () => {
    const f = TestBed.createComponent(RepeatHost);
    await f.whenStable();
    const texts = () => [...f.nativeElement.querySelectorAll('li')].map((li: HTMLElement) => li.textContent);
    expect(texts()).toEqual(['Item 0', 'Item 1', 'Item 2']);
    f.componentInstance.n.set(1);
    await f.whenStable();
    expect(texts()).toEqual(['Item 0']);
  });
});

describe('Challenge 3: TodoList', () => {
  it('adds, toggles, filters and counts', async () => {
    const f = TestBed.createComponent(TodoList);
    const c = f.componentInstance;
    c.add('Order pizza');
    c.add('  ');            // ignored
    c.add('Pay bill');
    c.toggle(1);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('.summary')?.textContent).toBe('1 left · 2 total');
    c.filter.set('done');
    await f.whenStable();
    expect([...el.querySelectorAll('li')].map((li) => li.textContent?.replace('✕', '').trim())).toEqual(['Order pizza']);
  });
});

describe('Challenge 4: Countdown', () => {
  // Fake only intervals: Angular's zoneless scheduler still needs real setTimeout/rAF for whenStable()
  beforeEach(() => vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] }));
  afterEach(() => vi.useRealTimers());

  it('counts down and stops at zero', async () => {
    const f = TestBed.createComponent(Countdown);
    f.componentRef.setInput('seconds', 65);
    await f.whenStable();
    expect(f.nativeElement.textContent).toBe('1:05');
    vi.advanceTimersByTime(6000);
    await f.whenStable();
    expect(f.nativeElement.textContent).toBe('0:59');
    vi.advanceTimersByTime(60_000);
    await f.whenStable();
    expect(f.nativeElement.textContent).toBe('Time up!');
  });

  it('clears its interval on destroy', () => {
    const f = TestBed.createComponent(Countdown);
    const before = vi.getTimerCount();
    f.destroy();
    expect(vi.getTimerCount()).toBe(before - 1);
  });
});

describe('Challenge 5: paginate()', () => {
  it('pages through items and clamps', () => {
    const items = signal(Array.from({ length: 12 }, (_, i) => i + 1));
    const p = paginate(items, 5);
    expect(p.pageItems()).toEqual([1, 2, 3, 4, 5]);
    p.next(); p.next(); p.next();
    expect(p.page()).toBe(3);
    expect(p.pageItems()).toEqual([11, 12]);
    expect(p.hasNext()).toBe(false);
    items.set([1, 2, 3]); // shrinking data clamps the current page
    expect(p.page()).toBe(1);
  });
});

describe('Challenge 6: typeahead()', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('debounces, skips short queries, cancels stale calls and survives errors', () => {
    const calls: string[] = [];
    const search = (q: string) => {
      calls.push(q);
      return q === 'boom' ? throwError(() => new Error('500')) : of([`${q}-1`, `${q}-2`]).pipe(delay(500));
    };
    const input$ = new Subject<string>();
    const results: string[][] = [];
    input$.pipe(typeahead(search)).subscribe((r) => results.push(r));

    input$.next('p'); input$.next('pi'); input$.next('piz');   // typed fast
    vi.advanceTimersByTime(300);                                // debounce → only 'piz' (server takes 500ms)
    input$.next('pizz');                                        // new query while 'piz' is in flight…
    vi.advanceTimersByTime(300 + 500);                          // …switchMap cancels 'piz', 'pizz' resolves
    input$.next('boom');
    vi.advanceTimersByTime(300);
    input$.next('x');                                           // too short → ignored
    vi.advanceTimersByTime(300);

    expect(calls).toEqual(['piz', 'pizz', 'boom']);
    expect(results).toEqual([['pizz-1', 'pizz-2'], []]);
  });
});
