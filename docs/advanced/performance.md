# Performance

## What to measure

| Metric | Good | Angular levers |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 s | SSR/prerender, `NgOptimizedImage` with `priority`, small initial bundle |
| **INP** (Interaction to Next Paint) | < 200 ms | OnPush/zoneless, signals, avoid long tasks, web workers |
| **CLS** (Cumulative Layout Shift) | < 0.1 | image `width`/`height`, `@defer` placeholders with fixed size, skeletons |
| Initial JS (transfer) | < ~150 kB | lazy routes, `@defer`, tree-shaking, budgets |

The food app's production build: **~105 kB transferred initially**, and every page is a lazy chunk of 1–2 kB.

```text
Initial total        | 389.85 kB raw | 105.51 kB transfer
Lazy: restaurant-menu-page 4.6 kB · checkout-page 3.2 kB · cart-page 3.2 kB · admin 1.7 kB …
```

## Checklist (in order of impact)

1. **Lazy-load routes** (`loadComponent`/`loadChildren`) and below-the-fold UI (`@defer`).
2. **OnPush + signals** (default in v22) and **zoneless**.
3. `@for` with a **stable `track`**.
4. **`NgOptimizedImage`**:
   ```html
   <img ngSrc="/img/hero.webp" width="1200" height="600" priority />          <!-- LCP image -->
   <img ngSrc="r1.jpg" width="300" height="200" loading="lazy" placeholder />  <!-- auto srcset with a loader -->
   ```
   ```typescript
   providers: [provideImageKitLoader('https://ik.imagekit.io/food')]  // or Cloudinary/Imgix/Netlify loaders
   ```
5. **SSR or prerendering** for public pages (LCP, SEO). See [SSR](ssr.md).
6. **Budgets** fail the build on regressions:
   ```json
   "budgets": [
     { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" },
     { "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
   ]
   ```
7. **Avoid heavy dependencies**. Check with:
   ```bash
   ng build --stats-json && npx esbuild-visualizer --metadata dist/food-delivery-app/stats.json --open
   ```
8. **Preload/prefetch**: `withPreloading(...)`, `@defer (prefetch on idle)`, `<link rel="preconnect" href="https://api…">`.
9. **Virtual scrolling** for long lists: `<cdk-virtual-scroll-viewport itemSize="72">` with `*cdkVirtualFor`.
10. **Web workers** for CPU-heavy work (fuzzy search, image processing).
11. **HTTP caching**: immutable hashed assets, `no-cache` on `index.html` (see [Nginx](../deploy/docker-nginx.md)).

## Profiling

- **Angular DevTools** (Chrome extension): component tree, profiler (CD cycles per component), injector tree, signal graph.
- Chrome **Performance** panel: Angular adds custom tracks (`ng serve` in dev mode) showing CD, templates and hooks.
- `ng.getComponent($0)` and `ng.applyChanges(cmp)` in the console (dev mode).
- **Lighthouse CI** in your pipeline for regression gates.

## Anti-patterns

| Anti-pattern | Fix |
|---|---|
| Method calls with heavy logic in templates | `computed()` or a pure pipe |
| `@for` without a meaningful `track` | `track item.id` |
| Subscribing in components and storing into fields | `toSignal` / `async` pipe |
| Importing a whole library (`lodash`) | `lodash-es` per-function imports or native |
| One giant `SharedModule` imported everywhere | standalone imports per component |
| Polling every second with no backoff | SSE/WebSocket, or exponential backoff and visibility API |
| Huge `index.html` inline JSON | fetch lazily, or use SSR `TransferState` |

## Interview corner

??? question "Our app takes 8 s to become interactive. Walk me through your investigation."
    1) Lighthouse + WebPageTest to get LCP, TBT and bundle sizes. 2) `ng build --stats-json` to find the biggest
    modules. 3) Check that routes are lazy and nothing heavy is imported eagerly (charts, moment, Material everywhere).
    4) Performance-panel recording to find long tasks and look for CD storms (zone + Default). 5) Fix in order: lazy loading
    and `@defer`, remove heavy deps, image optimisation, SSR or prerender for the landing page, OnPush and signals,
    caching headers. 6) Add budgets and Lighthouse CI so it doesn't regress.
