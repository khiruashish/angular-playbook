# Advanced Questions

??? question "1. How do signals work internally? Why are they 'glitch-free'?"
    Producers keep a version. Consumers record the producer versions they read. A write bumps the version and pushes
    a *dirty* flag (not values) to live consumers. Reads *pull*: a computed recomputes only if a dependency version
    changed, in dependency order. You never observe intermediate inconsistent states (glitches), because derivations
    are evaluated lazily and consistently at read time.
    ```typescript
    const a = signal(1);
    const b = computed(() => a() * 2);
    const c = computed(() => a() + b());
    effect(() => console.log(c()));
    a.set(2);
    ```
    Output: `3` then `6`. Never `4`, which would be the mixed-old/new value a naive push system might emit.

??? question "2. How does zoneless change detection know what to re-render?"
    Templates are reactive consumers. When a signal they read changes, the view is marked for refresh (and its
    ancestors for traversal), and the scheduler queues a tick. Template listeners, `markForCheck`, the async pipe and
    `setInput` also notify the scheduler. Only dirty views run their update code.

??? question "3. What breaks when migrating to zoneless?"
    Code relying on zone-triggered CD: plain fields mutated in `setTimeout`, promises or third-party callbacks;
    `NgZone.onStable`/`onMicrotaskEmpty`; `fakeAsync`/`tick` tests; libraries that call `zone.run`.
    Fix it with signals, `markForCheck`, `afterNextRender` and `whenStable` in tests.

??? question "4. Explain the v22 OnPush default and the `Eager` strategy."
    New components are OnPush unless they specify `ChangeDetectionStrategy.Eager` (the renamed "Default", which is
    deprecated). `ng update` runs `change-detection-eager` to add `Eager` to existing components, so behaviour is unchanged.

??? question "5. `effect` timing and pitfalls?"
    Effects are scheduled, not synchronous: component effects run during CD before the view refresh, root effects as
    microtasks. Pitfalls are infinite loops (writing a signal you read; use `untracked`), deriving state (use computed),
    and creating effects outside an injection context.

??? question "6. `resource` vs `rxResource` vs `httpResource`?"
    `resource` takes a Promise-based loader (`fetch`, SDKs). `rxResource` takes an Observable `stream`. `httpResource`
    is a thin wrapper over HttpClient (interceptors apply). All expose the same `ResourceRef` signals and abort on
    param change.

??? question "7. How would you design state for a large app?"
    Local signals → component-provided stores → feature stores (signal services or SignalStore) → global events only
    where several features react (NgRx Store). Keep server cache separate (resources or a query lib). URL state goes in
    the router. Single owner per piece of state, immutable updates, read-only public API.

??? question "8. NgRx Store vs SignalStore?"
    Store gives Redux: actions, reducers, effects and selectors. It has great devtools, decoupled event handling and
    more boilerplate. SignalStore gives composable signal-based stores (`withState/withComputed/withMethods`), less
    ceremony and good local or feature scope. Choose by team size and event complexity.

??? question "9. Explain SSR hydration and common mismatch causes."
    The server renders HTML, and the client hydrates by reusing DOM nodes and attaching listeners instead of
    re-rendering. Mismatches come from non-deterministic rendering (dates, random ids), invalid HTML nesting, direct
    DOM manipulation, and browser-only branches. Diagnose via NG0500 errors.

??? question "10. What is incremental hydration?"
    `@defer (hydrate on …)` blocks are server-rendered, but their JS loads and hydrates only on the trigger. It's
    enabled by default in v22 with `provideClientHydration()`.

??? question "11. Route-level render modes?"
    `ServerRoute[]` with `RenderMode.Prerender | Server | Client` per path (v19+). `getPrerenderParams` lists
    parameterised paths to prerender.

??? question "12. How do you prevent XSS in Angular?"
    Built-in contextual escaping and sanitisation; avoid `bypassSecurityTrust*` with user data; never touch
    `innerHTML` directly; add CSP + Trusted Types (`autoCsp`); audit dependencies.

??? question "13. Where should JWTs be stored?"
    Ideally not in JS-accessible storage. Use the BFF pattern (httpOnly SameSite cookies). If an SPA must hold tokens,
    use short-lived access tokens in memory with rotating refresh via OIDC + PKCE, plus strong XSS defences.

??? question "14. How do you avoid multiple simultaneous token refreshes?"
    A single-flight refresh observable shared with `shareReplay(1)`. Queue 401'd requests on it and retry them with
    the new token. See [Authentication](../security/authentication.md#token-refresh-with-request-queueing-custom-jwt-backends).

??? question "15. How do you make authorization robust in a SPA?"
    The UI uses guards (`canMatch` for chunks) and directives for UX. The API enforces every rule from verified claims.
    Prefer permission checks over role checks, and load permissions from token claims or `/me`.

??? question "16. How does `@defer` affect bundling?"
    The compiler moves dependencies used only inside the block into a separate chunk and generates a dynamic import.
    Prefetch triggers can load it before render.

??? question "17. How do you diagnose a slow interaction (bad INP)?"
    Record it in the Performance panel and find long tasks. Check the Angular DevTools profiler for components checked
    too often. Typical fixes: OnPush or signals, moving heavy computation to `computed` or a worker, virtual scrolling,
    avoiding sync layout thrash (`afterRenderEffect` phases).

??? question "18. How does `afterRenderEffect` differ from `effect`?"
    It runs after rendering in explicit phases (`earlyRead`, `write`, `mixedReadWrite`, `read`) to avoid layout
    thrashing, browser only. Use it for DOM measurement and imperative DOM writes driven by signals.

??? question "19. How do host directives help composition?"
    They attach reusable directive behaviour (with exposed inputs and outputs) to a component without inheritance or
    template wrappers: `hostDirectives: [{ directive: Tooltip, inputs: ['appTooltip: tip'] }]`.

??? question "20. Content projection limitations?"
    Projected content is created by the parent even if not rendered (conditional `<ng-content>` doesn't prevent
    instantiation). For lazy or conditional content, accept a `TemplateRef` (`contentChild(TemplateRef)`) and render
    it with `ngTemplateOutlet`.

??? question "21. How do you write a library with multiple entry points?"
    ng-packagr secondary entry points (`lib/button/ng-package.json`), `provideX()` APIs, peerDependencies on
    `@angular/*`, and `sideEffects: false`. See [Libraries](../advanced/libraries-monorepo.md).

??? question "22. Micro frontends: Module Federation vs Native Federation?"
    Module Federation is webpack-based. Native Federation does the same thing (runtime-loaded remotes, shared
    singletons) on browser-native ESM and import maps, so it works with the esbuild builder. Use it only for
    independent team deploys. It adds runtime complexity.

??? question "23. How do you handle environment config for 'build once, deploy many'?"
    Load `config.json` before bootstrap, provide it via an `InjectionToken`, and render the file from container env
    vars at startup. See [Environments](../deploy/environments.md#approach-2-runtime-config-build-once-deploy-many).

??? question "24. Explain `inject()` restrictions and `runInInjectionContext`."
    `inject()` must run synchronously during construction or factory execution. Outside that (callbacks, async code),
    capture an `Injector` and call `runInInjectionContext(injector, () => inject(X))`.

??? question "25. What are standalone `provideX` functions and `EnvironmentProviders`?"
    Typed provider bundles (`provideRouter`, `provideHttpClient`) that can only go into environment injectors
    (app or route), not component `providers`. They replace `Module.forRoot()`.

??? question "26. What does `strictTemplates` catch?"
    Type errors in templates: wrong input types, nullable access, invalid event payloads, unknown properties.
    It's on by default in v22.

??? question "27. How would you implement optimistic UI updates?"
    Update the local signal immediately, call the API, and roll back on error:
    ```typescript
    const prev = this.items();
    this.items.update((a) => a.filter((x) => x.id !== id));
    this.api.delete(id).subscribe({ error: () => { this.items.set(prev); this.notify.show('Undo: failed'); } });
    ```

??? question "28. How do you avoid duplicate HTTP calls on SSR + hydration?"
    HttpClient's transfer cache (enabled by default with `provideClientHydration()`) serialises server responses into
    the HTML, and the client reuses them.

??? question "29. Angular Elements use case and caveats?"
    Ship Angular components as custom elements for non-Angular hosts. Caveats: bundle size (include the runtime once),
    zone-less CD with signals, style encapsulation (use ShadowDom), and attribute vs property inputs.

??? question "30. How do you migrate a large NgModule app to standalone?"
    `ng g @angular/core:standalone` in three passes (convert declarations → remove unnecessary modules → bootstrap
    with `bootstrapApplication`). Then switch to `provideX` APIs, lazy routes with `loadComponent`, and
    control-flow and signal migrations, feature by feature with tests green.

??? question "31. How does `track` interact with immutable updates?"
    With `track item.id`, replacing an item object with a new reference (same id) updates that row's bindings and
    keeps its DOM node. With `track item` (identity), every replaced object recreates its row.

??? question "32. How would you implement a permission-aware menu efficiently?"
    A `computed` filtering menu config by `permissions()`, rendered with `@for`. Changes in roles (re-login) propagate
    automatically. No subscriptions or manual CD.

??? question "33. When would you choose `ShadowDom` encapsulation?"
    For widgets embedded in foreign pages (Elements), or for strict style isolation. Trade-offs: global styles and
    theme classes don't penetrate (use CSS variables and `::part`), and some libs expect light DOM.

??? question "34. What's new in templates in v20–v22 worth knowing?"
    `**`, `in`, `void`, `typeof`, tagged template literals (v20); regex literals (v21); `?.` now follows TS semantics,
    returning `undefined` (v22).

??? question "35. How do you test effects and resources?"
    Effects: `TestBed.tick()` or `await fixture.whenStable()`. Resources: provide `provideHttpClientTesting()`, read
    `status()`, flush via `HttpTestingController`, then `await whenStable()` (or `TestBed.tick()`) and assert `value()`.

??? question "36. Explain the Fetch backend default in v22."
    HttpClient uses `fetch` by default (better for SSR and streaming). `reportProgress` upload events need XHR, so opt
    in with `withXhr()`. The `http-xhr-backend` migration adds it where `HttpXhrBackend` was used.

??? question "37. Explain the `CanMatchFn` signature change in v22."
    It now receives a third argument, `currentSnapshot` (partial route snapshot), so guards can read params during
    matching. Direct call sites, typically in tests, must pass it. A migration updates them.

??? question "38. How do you profile change detection?"
    Angular DevTools Profiler (CD cycles, time per component, what triggered it), `ng.profiler` in dev mode, and
    Chrome Performance with Angular custom tracks.

??? question "39. How do you guarantee a single in-flight request per key?"
    A `Map<string, Observable<T>>` cache with `shareReplay(1)` and `finalize` deletion, or `exhaustMap` at the event
    source for user actions.

??? question "40. What's your approach to error boundaries in Angular?"
    Angular has no React-style error boundaries. Combine `@defer @error` for lazy blocks, resource `error()` states per
    widget, `catchError` per stream, and a global ErrorHandler. Design every async UI with loading, empty, error and
    success states.
