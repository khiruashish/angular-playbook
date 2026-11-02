# Coding Challenges

Every solution on this page is a real file in `examples/food-delivery-app/src/challenges/`, covered by
`challenges.spec.ts` (all passing). The JavaScript and RxJS "predict the output" answers were produced by running
the code with Node.js.

## Part A: Predict the output (JavaScript fundamentals)

??? question "A1. Event loop: sync vs microtasks vs macrotasks"
    ```javascript
    console.log('1 sync');
    setTimeout(() => console.log('2 timeout'), 0);
    Promise.resolve().then(() => console.log('3 microtask'));
    queueMicrotask(() => console.log('4 queueMicrotask'));
    (async () => { console.log('5 async body'); await null; console.log('6 after await'); })();
    console.log('7 sync end');
    ```
    !!! output "Output"
        ```text
        1 sync
        5 async body
        7 sync end
        3 microtask
        4 queueMicrotask
        6 after await
        2 timeout
        ```
    Sync code runs first (an async function body runs synchronously until its first `await`). Then the **whole
    microtask queue** runs in FIFO order. Then one macrotask (the timer).

??? question "A2. Closures with `var` vs `let`"
    ```javascript
    for (var i = 0; i < 3; i++) setTimeout(() => console.log('var', i));
    for (let j = 0; j < 3; j++) setTimeout(() => console.log('let', j));
    ```
    !!! output "Output"
        ```text
        var 3
        var 3
        var 3
        let 0
        let 1
        let 2
        ```
    `var` is function-scoped (one shared `i`). `let` creates a fresh binding per iteration.

??? question "A3. `this` in methods vs arrow functions"
    ```javascript
    const obj = { name: 'cart', regular() { return this?.name; }, arrow: () => typeof this };
    const { regular } = obj;
    console.log(obj.regular(), regular(), obj.arrow());
    ```
    !!! output "Output (ES module)"
        ```text
        cart undefined undefined
        ```
    A detached method loses `this`. Arrow functions take `this` from the enclosing scope, which is `undefined` at module top level.
    This is why Angular templates call `(click)="save()"` on the instance, and why passing `this.save` as a callback needs an arrow or `bind`.

??? question "A4. Floating point (why money is in paise)"
    ```javascript
    console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);
    console.log((10 + 20) / 100 === 0.3);
    console.log([1, 2, 10].sort(), [1, 2, 10].sort((a, b) => a - b));
    console.log(typeof null, Array.isArray([]), NaN === NaN, Object.is(NaN, NaN));
    ```
    !!! output "Output"
        ```text
        false 0.30000000000000004
        true
        [ 1, 10, 2 ] [ 1, 2, 10 ]
        object true false true
        ```

??? question "A5. References and immutability (why OnPush misses mutations)"
    ```javascript
    const a = { qty: 1 }; const b = a; b.qty = 2;
    const c = { ...a, qty: 3 };
    console.log(a.qty, b.qty, c.qty, a === b, a === c);
    const nested = { item: { qty: 1 } }; const shallow = { ...nested }; shallow.item.qty = 9;
    console.log(nested.item.qty, structuredClone(nested) !== nested);
    ```
    !!! output "Output"
        ```text
        2 2 3 true false
        9 true
        ```
    Spread is **shallow**. OnPush and signals compare references, so update nested state immutably at every level.

## Part B: Predict the output (RxJS)

??? question "B1. filter, map, scan and Subjects"
    ```typescript
    of(1, 2, 3, 4, 5).pipe(filter((n) => n % 2 === 1), map((n) => n * 10), toArray()).subscribe((v) => console.log('A', v));
    of(5, 10, 20).pipe(scan((acc, v) => acc + v, 0)).subscribe((v) => console.log('B', v));
    const s = new Subject<string>(); s.next('lost'); s.subscribe((v) => console.log('C', v)); s.next('seen');
    const b = new BehaviorSubject('init'); b.subscribe((v) => console.log('D1', v)); b.next('x'); b.subscribe((v) => console.log('D2', v));
    ```
    !!! output "Output"
        ```text
        A [ 10, 30, 50 ]
        B 5
        B 15
        B 35
        C seen
        D1 init
        D1 x
        D2 x
        ```

??? question "B2. switchMap vs mergeMap vs concatMap vs exhaustMap"
    `a` takes 30 ms, `b` and `c` take 10 ms each. All three source values arrive synchronously.
    ```typescript
    const src = (op) => of('a', 'b', 'c').pipe(op((x) => of(x.toUpperCase()).pipe(delay(x === 'a' ? 30 : 10))));
    src(mergeMap).pipe(toArray()).subscribe((v) => console.log('mergeMap ', v.join('')));
    src(concatMap).pipe(toArray()).subscribe((v) => console.log('concatMap', v.join('')));
    src(switchMap).pipe(toArray()).subscribe((v) => console.log('switchMap', v.join('')));
    src(exhaustMap).pipe(toArray()).subscribe((v) => console.log('exhaustMap', v.join('')));
    ```
    !!! output "Output (in completion order)"
        ```text
        switchMap C
        mergeMap  BCA
        exhaustMap A
        concatMap ABC
        ```
    switch keeps only the latest (C). merge runs all in parallel, so the fastest finish first (B, C, then A).
    exhaust ignores b and c while a runs. concat queues them in order.

## Part C: Build it (Angular)

??? question "C1. Write a `truncate` pipe that cuts at word boundaries"
    ```typescript title="src/challenges/truncate.pipe.ts"
    --8<-- "src/challenges/truncate.pipe.ts"
    ```
    !!! output "Output"
        ```text
        'Butter chicken with garlic naan' | truncate:18  →  'Butter chicken…'
        'Dosa' | truncate:10                            →  'Dosa'
        'Supercalifragilistic' | truncate:5             →  'Super…'
        ```

??? question "C2. Write a structural directive `*appRepeat=\"n; let i\"`"
    ```typescript title="src/challenges/repeat.directive.ts"
    --8<-- "src/challenges/repeat.directive.ts"
    ```
    !!! output "Output for n = 3, then n = 1"
        ```text
        Item 0 · Item 1 · Item 2
        Item 0
        ```
    Key points: `TemplateRef` + `ViewContainerRef`, an `effect` to react to the signal input, and
    `ngTemplateContextGuard` for typed `let` variables.

??? question "C3. Todo list with signals (add / toggle / remove / filter / counts)"
    ```typescript title="src/challenges/todo-list.ts"
    --8<-- "src/challenges/todo-list.ts"
    ```
    !!! output "Output"
        ```text
        add('Order pizza'), add('  '), add('Pay bill'), toggle(1)
        → "1 left · 2 total";  filter 'done' → [Order pizza]
        ```

??? question "C4. Countdown timer without memory leaks"
    ```typescript title="src/challenges/countdown.ts"
    --8<-- "src/challenges/countdown.ts"
    ```
    !!! output "Output"
        ```text
        seconds=65 → 1:05 → (6s) 0:59 → (60s) Time up!
        destroy() → interval cleared (timer count drops by 1)
        ```
    The test fakes **only** `setInterval`/`clearInterval`. Faking every timer would also freeze the zoneless
    scheduler and make `whenStable()` hang. I hit exactly that while writing it.

??? question "C5. Reusable pagination with signals"
    ```typescript title="src/challenges/paginate.ts"
    --8<-- "src/challenges/paginate.ts"
    ```
    !!! output "Output"
        ```text
        12 items, size 5 → page 1 [1..5]; next×3 → page 3 [11, 12], hasNext=false
        items shrink to 3 → page clamps to 1
        ```

??? question "C6. Typeahead operator: debounce, min length, cancel stale, survive errors"
    ```typescript title="src/challenges/typeahead.ts"
    --8<-- "src/challenges/typeahead.ts"
    ```
    ```mermaid
    sequenceDiagram
        participant K as Keystrokes
        participant D as debounce 300ms
        participant S as switchMap
        participant API as search() (500ms)
        K->>D: p, pi, piz (fast)
        D->>S: "piz"
        S->>API: search(piz)
        K->>D: pizz
        D->>S: "pizz"
        S--xAPI: cancel piz
        S->>API: search(pizz)
        API-->>S: [pizz-1, pizz-2] ✓
        K->>D: boom → API error → [] (stream survives)
        K->>D: x → filtered (too short)
    ```
    !!! output "Output"
        ```text
        calls:   ['piz', 'pizz', 'boom']
        results: [['pizz-1', 'pizz-2'], []]
        ```

## Part D: Whiteboard tasks (solutions in the food app)

| Task | Where to look |
|---|---|
| Auth interceptor that only adds the token for your API | [`auth.interceptor.ts`](../security/authentication.md#attaching-the-token) |
| Functional `authGuard` + `roleGuard` with `UrlTree` redirects | [`auth.guards.ts`](../security/authorization.md) |
| Signal store for a cart with derived totals and a business rule | [`cart.store.ts`](../reactivity/state-management.md) |
| Debounced search with loading / error states | [`restaurant-list.page.ts`](../case-study/code-walkthrough.md) |
| Polling until a terminal state | [`order-api.ts`](../case-study/code-walkthrough.md#7-order-api-live-tracking) |
| Custom form validator + unsaved-changes guard | [Forms](../core/forms.md) |
| Signal Forms with cross-field validation | [`order-feedback.ts`](../core/forms.md#3-signal-forms-stable-in-v22) |
| `ControlValueAccessor` star rating | [Forms](../core/forms.md#4-custom-form-control-controlvalueaccessor) |
| Structural directive for roles | [`has-role.directive.ts`](../security/authorization.md) |

Run them yourself:

```bash
cd examples/food-delivery-app
npx ng test --watch=false --include "src/challenges/**/*.spec.ts"
```
