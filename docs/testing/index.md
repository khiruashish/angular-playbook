# Testing

| Layer | Tool (v22) | What | Food-app files |
|---|---|---|---|
| Unit | **Vitest 5** via `ng test` | pure functions, pipes, validators, stores | `inr.pipe.spec.ts`, `cart.store.spec.ts`, `pincode.validator.spec.ts`, `challenges.spec.ts` |
| Service + HTTP | Vitest + TestBed + `HttpTestingController` | API services, interceptors | `restaurant-api.spec.ts`, `auth.interceptor.spec.ts` |
| Guards / DI | TestBed `runInInjectionContext` | guards, resolvers | `auth.guards.spec.ts` |
| Component | TestBed + DOM / harnesses | inputs, outputs, rendering, forms | `restaurant-card.spec.ts`, `login.page.spec.ts`, `order-feedback.spec.ts`, `has-role.directive.spec.ts` |
| E2E | **Playwright** | user journeys in a real browser | `e2e/order-flow.spec.ts` |

```bash
cd examples/food-delivery-app
npm test                 # watch mode
npm run test:ci          # single run + coverage
npm run e2e              # Playwright (starts ng serve automatically)
```

!!! output "Actual output from the example app"
    ```text
     Test Files  13 passed (13)
          Tests  52 passed (52)
       Duration  2.59s

    All files          |   78.17 % Stmts |   74.7 % Branch |   67.39 % Funcs |   81.87 % Lines

    Running 2 tests using 2 workers
      ✓  [chromium] › e2e/order-flow.spec.ts › customers cannot reach /admin (1.4s)
      ✓  [chromium] › e2e/order-flow.spec.ts › browse → add to cart → login → checkout → track (3.7s)
      2 passed (9.4s)
    ```

<div class="cards3d">
<a class="tilt" href="unit-testing/"><span class="ico">🧪</span><b>Unit Testing</b><span>Vitest, TestBed, services, HTTP, guards</span></a>
<a class="tilt" href="component-testing/"><span class="ico">🧩</span><b>Component Testing</b><span>DOM, inputs, outputs, forms, harnesses</span></a>
<a class="tilt" href="e2e/"><span class="ico">🎭</span><b>E2E</b><span>Playwright setup, patterns, CI</span></a>
</div>
