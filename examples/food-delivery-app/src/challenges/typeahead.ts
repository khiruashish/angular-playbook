import { Observable, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

/**
 * Challenge 6: classic typeahead operator chain, as a reusable function.
 * - ignore queries shorter than `minLength`
 * - wait for a typing pause
 * - skip duplicates
 * - cancel stale requests (switchMap)
 * - never let one failed request kill the stream (catchError inside switchMap)
 */
export function typeahead<T>(
  search: (q: string) => Observable<T[]>,
  { debounceMs = 300, minLength = 2 } = {},
) {
  return (query$: Observable<string>): Observable<T[]> =>
    query$.pipe(
      map((q) => q.trim()),
      debounceTime(debounceMs),
      distinctUntilChanged(),
      filter((q) => q.length === 0 || q.length >= minLength),
      switchMap((q) => (q ? search(q).pipe(catchError(() => of([] as T[]))) : of([] as T[]))),
    );
}
