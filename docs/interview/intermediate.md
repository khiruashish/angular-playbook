# Intermediate Questions

??? question "1. Explain change detection and OnPush."
    CD walks the component tree and updates bindings whose values changed. An **OnPush** component (the default in
    v22) is checked only when an input reference changes, a template-read signal changes, an event fires inside it,
    the async pipe emits, or `markForCheck()` is called. See [Change Detection](../core/change-detection.md).

??? question "2. Why doesn't my OnPush child update when I push to an array?"
    The reference didn't change. Use `items = [...items, x]` or `items.update(a => [...a, x])`.

??? question "3. What is zone.js and what does zoneless mean?"
    zone.js monkey-patches async APIs to trigger CD automatically. Zoneless (the default from v21) removes it, and CD
    is scheduled by signals, template events, `markForCheck`, the async pipe and `setInput`.

??? question "4. Observable vs Promise?"
    | | Promise | Observable |
    |---|---|---|
    | Values | one | zero to many |
    | Eager/lazy | eager | lazy (cold) |
    | Cancel | no | unsubscribe |
    | Operators | then/catch | 100+ (map, retry, debounce…) |

??? question "5. Subject vs BehaviorSubject vs ReplaySubject?"
    Subject has no initial value and no replay. BehaviorSubject requires an initial value and replays the latest.
    ReplaySubject replays the last N values.
    ```typescript
    const b = new BehaviorSubject(1); b.next(2); b.subscribe(console.log); // 2
    const r = new ReplaySubject(2); r.next(1); r.next(2); r.next(3); r.subscribe(console.log); // 2, 3
    ```

??? question "6. switchMap vs mergeMap vs concatMap vs exhaustMap?"
    Cancel previous / run parallel / queue / ignore while busy. Typeahead → switch, uploads → merge,
    ordered saves → concat, submit button → exhaust. See [RxJS](../reactivity/rxjs.md).

??? question "7. How do you avoid memory leaks with subscriptions?"
    Prefer `async` pipe or `toSignal`. Otherwise use `takeUntilDestroyed(destroyRef)`. HttpClient completes on its own,
    but long-lived streams (`interval`, `fromEvent`, store selects) must be torn down.

??? question "8. combineLatest vs forkJoin vs zip?"
    combineLatest emits on any change once all sources have emitted. forkJoin emits once when all complete (parallel
    HTTP). zip pairs values by index.

??? question "9. How do you share one HTTP response among several subscribers?"
    `shareReplay({ bufferSize: 1, refCount: true })`, or convert it once to a signal.

??? question "10. What is the hierarchical injector?"
    Element injectors (component and directive `providers`) form a tree, above environment injectors (route → root →
    platform → null). Resolution walks up and throws NG0201 if nothing provides the token.

??? question "11. `useClass` vs `useValue` vs `useFactory` vs `useExisting`?"
    Instantiate a class, use a constant, call a function (which can `inject()` other things), or alias another token.

??? question "12. What is an InjectionToken and when do you need one?"
    A DI key for non-class values (config objects, functions, interfaces): `new InjectionToken<AppEnvironment>('APP_ENV')`.
    It's needed because TS interfaces don't exist at runtime.

??? question "13. How do you make a service instance per component?"
    List it in `@Component({ providers: [WizardStore] })`. Each component instance gets its own, destroyed with it.

??? question "14. What are `@Input` transforms?"
    Functions converting incoming values: `input(false, { transform: booleanAttribute })` lets `<x disabled>` mean `true`.

??? question "15. What is `model()`?"
    A writable signal input that also emits `xChange`, enabling `[(x)]` two-way binding with signals.

??? question "16. What is `linkedSignal`?"
    Writable state derived from a source that resets when the source changes:
    `size = linkedSignal(() => product().sizes[0])`.

??? question "17. When would you use `effect`?"
    Only for side effects that sync signals to non-signal worlds: localStorage, logging, imperative DOM or charts.
    Never use it to derive state.

??? question "18. Explain `toSignal` and `toObservable`."
    `toSignal(obs$, { initialValue })` subscribes (in an injection context) and exposes the latest value as a signal,
    unsubscribing on destroy. `toObservable(sig)` emits signal values via an effect (asynchronously).

??? question "19. What is `httpResource`?"
    A signal-based HTTP fetch (stable in v22): `r = httpResource<T>(() => url())` with `value()`, `isLoading()`,
    `error()` and `reload()`. It re-fetches when the URL signal changes and aborts stale requests.

??? question "20. Typed reactive forms: how and why?"
    Since v14 `FormControl<string>` etc. are typed, so `form.getRawValue()` has a precise type. Use
    `NonNullableFormBuilder` to avoid `| null`.

??? question "21. How do you write a custom validator?"
    ```typescript
    export const pincodeValidator: ValidatorFn = (c) => (/^[1-9]\d{5}$/.test(c.value ?? '') ? null : { pincode: true });
    ```
    Async validators return `Observable<ValidationErrors | null>`.

??? question "22. How do you implement a cross-field validator?"
    Put a validator on the `FormGroup` that compares children (password/confirm). In Signal Forms, use
    `validate(p.confirm, ({ value, valueOf }) => value() !== valueOf(p.password) ? {kind:'mismatch'} : undefined)`.

??? question "23. What is ControlValueAccessor?"
    The interface (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) that lets a custom
    component act as a form control with `formControlName`/`ngModel`.

??? question "24. Functional vs class interceptors?"
    Functional (`HttpInterceptorFn`, v15+) are plain functions using `inject()`, registered with
    `withInterceptors([...])`. Class interceptors need `HTTP_INTERCEPTORS` + `withInterceptorsFromDi()`. Prefer functional.

??? question "25. In what order do interceptors run?"
    Requests go in array order. Responses come back in reverse order.

??? question "26. How would you retry failed requests?"
    `retry({ count: 2, delay: (err, n) => isRetriable(err) ? timer(n * 300) : throwError(() => err) })`. Only retry
    idempotent requests, or ones protected by an Idempotency-Key.

??? question "27. Route guards: what types exist?"
    `canActivate`, `canActivateChild`, `canDeactivate`, `canMatch`, plus `resolve` for data. Modern guards are
    functions returning `boolean | UrlTree | Observable | Promise`.

??? question "28. canActivate vs canMatch?"
    canMatch runs before lazy code is loaded and lets the router try other routes. canActivate runs after matching
    and loading. Use canMatch for role-based features.

??? question "29. What is a resolver and its drawback?"
    It pre-fetches data before activation. The drawback is that navigation feels frozen until the data arrives. Often
    it's better to navigate immediately and show a skeleton.

??? question "30. How does `withComponentInputBinding` work?"
    Route params, query params, `data` and resolver results are bound to component inputs with matching names.

??? question "31. Preloading strategies?"
    `NoPreloading` (default), `PreloadAllModules`, or a custom strategy (flag-based, network-aware) that preloads lazy
    routes after the app is idle.

??? question "32. What does `@defer` require of its contents?"
    Deferred dependencies must be standalone and not referenced elsewhere in the same file, or they get bundled
    eagerly. Viewport, interaction and hover triggers without a target need a `@placeholder`.

??? question "33. Pure vs impure pipes?"
    Pure pipes re-run only when the input reference changes (memoised). Impure pipes run every CD. Prefer pure pipes
    or `computed`.

??? question "34. How do you unit test a service that uses HttpClient?"
    `provideHttpClient(), provideHttpClientTesting()`, then `HttpTestingController.expectOne(url).flush(data)`, and
    `verify()` in afterEach. See [Unit Testing](../testing/unit-testing.md).

??? question "35. How do you set a signal input in a component test?"
    `fixture.componentRef.setInput('restaurant', value)`, then `await fixture.whenStable()`.

??? question "36. `fixture.detectChanges()` vs `whenStable()`?"
    detectChanges is synchronous, one pass. whenStable awaits scheduled CD, effects and pending tasks (preferred in
    zoneless tests).

??? question "37. How do you test a guard?"
    `TestBed.runInInjectionContext(() => authGuard(route, state))` with fake services, then assert `true` or the
    serialized `UrlTree`.

??? question "38. ViewChild vs ContentChild?"
    ViewChild queries the component's **own template**. ContentChild queries **projected content** (`<ng-content>`).

??? question "39. What is `NG0100 ExpressionChangedAfterItHasBeenChecked`?"
    A dev-mode error when a binding changes during the verification pass. Usually it's state set in
    `ngAfterViewInit` or an unstable getter. Fix it with `computed`, by moving the logic, or with signals.

??? question "40. How do you handle global errors?"
    A custom `ErrorHandler` + `provideBrowserGlobalErrorListeners()`, an HTTP error interceptor, and reporting to
    Sentry or OpenTelemetry.

??? question "41. What is `trackBy`/`track` performance impact?"
    Without a stable key, list changes recreate DOM rows (slow, and they lose focus). With `track item.id` only
    changed rows update.

??? question "42. Explain `providedIn: 'root'` vs route-level providers."
    Root gives an app-wide singleton. `Route.providers` gives an instance scoped to that route subtree, created when the
    route is first activated.

??? question "43. What is `takeUntilDestroyed`?"
    An rxjs-interop operator that completes the stream when the current `DestroyRef` (component, directive or service)
    is destroyed. Without an argument it must be called in an injection context.

??? question "44. How do you configure a proxy for the dev server?"
    `proxy.conf.json` with `{ "/api": { "target": "http://localhost:8080", "changeOrigin": true } }`, plus
    `"proxyConfig"` in the serve target or `ng serve --proxy-config`.

??? question "45. How do you analyse bundle size?"
    `ng build --stats-json`, then `esbuild-visualizer` or `source-map-explorer`. Enforce limits with budgets.
