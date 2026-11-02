# Pipes

Pipes **transform values for display**: `{{ value | pipe:arg1:arg2 }}`.

## Built-in pipes

```html
{{ 'angular' | uppercase }}                         <!-- ANGULAR -->
{{ 'Hello World' | lowercase }}                     <!-- hello world -->
{{ 'hello world' | titlecase }}                     <!-- Hello World -->
{{ 1234.5 | number:'1.2-2' }}                       <!-- 1,234.50 -->
{{ 0.256 | percent:'1.1-1' }}                       <!-- 25.6% -->
{{ 249.5 | currency:'INR':'symbol':'1.2-2':'en-IN' }} <!-- ₹249.50 -->
{{ now | date:'dd MMM yyyy, HH:mm' }}               <!-- 02 Nov 2026, 18:30 -->
{{ order | json }}                                  <!-- {"id":"o1001",…} -->
{{ [1,2,3,4,5] | slice:1:3 }}                       <!-- 2,3 -->
{{ { b: 2, a: 1 } | keyvalue }}                     <!-- iterate sorted [{key:'a',value:1},…] -->
{{ orders$ | async }}                               <!-- subscribes/unsubscribes automatically -->
{{ count | i18nPlural: { '=0': 'no items', '=1': 'one item', other: '# items' } }}
```

## Custom pure pipe (from the food app)

```typescript title="shared/pipes/inr.pipe.ts"
--8<-- "src/app/shared/pipes/inr.pipe.ts"
```

```html
<b>{{ item.price | inr }}</b>
```

!!! output "Output"
    ```text
    24950 | inr  → ₹249.50
    100000 | inr → ₹1,000.00
    ```

## Pure vs impure

| | Pure (default) | Impure (`pure: false`) |
|---|---|---|
| Re-runs when | the **input reference** changes | **every** change-detection cycle |
| Cost | memoised, cheap | can be expensive |
| Example | `date`, `currency`, `inr` | `async`, `json`, `keyvalue` (on mutated objects) |

```typescript
@Pipe({ name: 'filterBy', pure: false })   // ⚠ runs every CD, so prefer computed()
export class FilterByPipe implements PipeTransform {
  transform<T>(items: T[], pred: (t: T) => boolean) { return items.filter(pred); }
}
```

!!! tip "Pipes vs `computed()`"
    In signal-based components a `computed()` often replaces a custom pipe for *component-specific* derivations.
    Keep pipes for **reusable formatting** used across many templates.

## Using a pipe in TypeScript

```typescript
providers: [DatePipe]
private date = inject(DatePipe);
label = computed(() => this.date.transform(this.order().placedAt, 'short'));
```

## Interview corner

??? question "Why does `items.push(x)` not update a pure pipe's output?"
    A pure pipe only re-runs when the **reference** changes. Mutating the array keeps the same reference.
    Use immutable updates (`items = [...items, x]` or `signal.update(a => [...a, x])`).

??? question "How does the `async` pipe avoid memory leaks?"
    It subscribes when the view is created, unsubscribes in `ngOnDestroy`, and marks the view for check on each emission
    (so it also works with OnPush and zoneless).
