# Expert & Scenario Questions

These are open-ended. Interviewers look for **structured thinking, trade-offs and real experience**.

??? question "1. Design the front-end architecture for a food-delivery platform (customer, restaurant and rider apps)."
    - **Apps:** customer web (SSR for SEO on restaurant pages), restaurant dashboard (CSR, heavy forms and tables),
      admin. Mobile via Flutter or Ionic, or a PWA for riders.
    - **Monorepo** (Nx) with libs: `ui-kit` (design system), `data-access-*` (generated OpenAPI clients + stores),
      `feature-*`, `util-*`. Module-boundary lint rules.
    - **Rendering:** customer landing and restaurant pages prerendered or SSR'd, cart and checkout CSR, incremental
      hydration for below-the-fold sections.
    - **State:** signals and SignalStore for client state, `httpResource` for server state, URL for filters.
    - **Real-time:** order tracking via SSE or WebSocket, with a polling fallback (as in the example app).
    - **Auth:** OIDC + PKCE or a BFF. Role and permission claims, `canMatch` guards, API-enforced.
    - **Quality:** Vitest + Playwright, contract tests against OpenAPI, Lighthouse CI budgets, Sentry, feature flags.
    - **Delivery:** build once and deploy many (runtime config), CDN, blue-green or canary, instant rollback.

??? question "2. Your app has 300 components on Angular 14 with NgModules. Plan the migration to 22."
    1. Stabilise: CI green, raise test coverage on critical flows, add E2E smoke tests.
    2. `ng update` one major at a time (15 → … → 22), fixing deprecations and third-party libs at each step.
    3. Run the standalone migration in phases. Bootstrap with `bootstrapApplication`.
    4. Run the control-flow, signal-input/output/query and `inject()` migrations. Use `loadComponent` for routes.
    5. Make OnPush explicit everywhere (v22 does it by default), then convert state to signals feature by feature.
    6. Go zoneless last, after removing `NgZone` dependencies and converting `fakeAsync` tests.
    7. Track it: a dashboard of % standalone, % OnPush, bundle size and LCP/INP. Do it alongside feature work, never a big bang.

??? question "3. Production incident: after a deploy, some users see a blank page. Diagnose."
    Likely stale `index.html` referencing chunk hashes that were deleted, so `ChunkLoadError` appears for users on the
    old shell. Confirm in the console and Sentry. Fixes: `Cache-Control: no-cache` for index.html; keep old chunks for
    a release or two (don't `--delete` immediately); handle chunk-load failures with a reload prompt; with a service
    worker, handle `unrecoverable`. Prevent it with a canary deploy and synthetic monitoring.

??? question "4. Checkout sometimes creates duplicate orders. Why, and how do you fix it in the front-end and back-end?"
    Front-end: double clicks or retries. Use `exhaustMap` or a disabled button with `placing()`, and **never auto-retry
    non-idempotent POSTs** without a key. Send an `Idempotency-Key` (the example app's `idempotencyInterceptor`).
    Back-end: store keys and return the original response for repeats. Both layers are needed.

??? question "5. A dashboard with 5,000 rows and live updates freezes the browser. What do you do?"
    Virtual scroll (CDK). `track` by id. Immutable row updates batched per animation frame (buffer socket messages,
    e.g. `bufferTime(250)`). Signals with OnPush so only changed rows re-render. Move sorting and filtering to a web
    worker or the server. Avoid heavy pipes per cell. Profile with Angular DevTools.

??? question "6. How do you enforce architecture rules in a 40-developer Angular codebase?"
    Lint rules (Nx module boundaries or eslint-plugin-boundaries), ArchUnit-style dependency checks in CI, generators
    and schematics for consistent scaffolding, a design system library, ADRs, CODEOWNERS on core libs, bundle budgets,
    and a PR checklist. Make the right thing the easy thing.

??? question "7. When would you NOT choose Angular?"
    Mostly static content sites (Astro or a static generator is lighter), tiny widgets embedded in other stacks
    (consider Lit or vanilla web components), and teams with deep React expertise and no Angular experience on a tight
    deadline. Angular shines for large, long-lived, team-built business applications.

??? question "8. Explain how you would implement feature flags."
    A `FeatureFlags` service exposing signals from remote config (LaunchDarkly, Unleash, or `config.json`),
    `provideAppInitializer` to load before first render, a `*appFeature="'newCheckout'"` structural directive, a
    `canMatch` guard for whole routes, and cleanup tickets to remove flags. Flags are not security.

??? question "9. How do you approach accessibility at scale?"
    Accessible design-system components (Angular Aria or CDK primitives), lint rules for templates, axe in Playwright
    E2E, manual screen-reader passes per release, focus management on route change, and an a11y item in the Definition
    of Done.

??? question "10. Your bundle grew by 400 kB after a PR. How do you catch and fix it?"
    Budgets fail the build. Compare `stats.json` between main and the PR (bundle-diff bot). The usual cause is an
    eager import of a heavy lib (charts, moment, lodash), or a lazy component imported from an eager file. Fix it with
    `@defer`, dynamic `import()`, or a lighter dependency.

??? question "11. SSR page shows the wrong user's data briefly. Cause?"
    Server-side state leaking across requests: module-level variables or root singletons holding user data on a Node
    server that serves many users. Keep per-request state in request-scoped providers (the `REQUEST` token) and never
    cache personalised responses at the CDN. Mark personalised routes `RenderMode.Client` where appropriate.

??? question "12. How do you share code between Angular web and other front-ends?"
    Framework-agnostic TS libs (domain models, validation, API clients generated from OpenAPI) in the monorepo.
    Angular-specific code wraps them. For UI, Angular Elements or a web-component design system (Lit, Stencil) when
    multiple frameworks must consume it.

??? question "13. Walk through what happens when a user clicks 'Add to cart' in a zoneless v22 app."
    The `(click)` listener calls `cart.add(item)`, and `_lines.update()` bumps the signal version. Consumers are marked
    dirty: the header badge (`count()`), the menu stepper (`qtyOf()`), the cart bar (`subtotal()`), and the
    persistence `effect`. The scheduler queues a tick, and only views reading those signals refresh. The effect writes
    to localStorage. No zone, no full-tree check.

??? question "14. How would you test the whole order flow without a backend in CI?"
    The same thing the example app does: a mock-API interceptor implementing the contract (enabled by environment) for
    fast PR checks, Playwright against `ng serve`, and contract tests to keep the mock honest against the OpenAPI spec.
    After deploy, a smoke E2E against QA with real services.

??? question "15. What metrics do you put on a front-end team dashboard?"
    Core Web Vitals (p75 LCP, INP, CLS) from RUM, JS error rate and top errors, bundle size trend, build time, test
    pass rate and flakiness, coverage of critical paths, a11y violations, dependency freshness (Angular version lag),
    and deployment frequency and lead time.
