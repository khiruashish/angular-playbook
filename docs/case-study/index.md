# Case Study: FoodDash Food Delivery App

A complete Angular 22 app in `examples/food-delivery-app`. Browse restaurants, view menus, manage the cart, log in,
check out, track the order live and rate it, plus an admin dashboard behind role-based access.

<img class="screen" src="../assets/screens/01-home.png" alt="FoodDash home screen" />

## Run it

```bash
cd examples/food-delivery-app
npm ci
npm start                     # http://localhost:4200 (mock API, no backend needed)
```

Demo users (mock API): `customer@food.dev` / `password` (CUSTOMER) and `admin@food.dev` / `password` (CUSTOMER + ADMIN).

## Feature → Angular concept map

| Feature | Angular concepts used |
|---|---|
| Restaurant list with search, veg filter, sort | signals, `computed`, `toObservable` + `debounceTime` + `switchMap`, `toSignal`, `@switch`, `@for … @empty`, skeletons, `@defer (on viewport)` |
| Restaurant card | presentational component, `input.required`, `output`, custom pipe, child component |
| Menu page `/restaurants/:id` | `withComponentInputBinding`, **`httpResource`**, `computed` grouping, `@let` |
| Cart | **signal store** service, `effect` → localStorage, business rules in `computed` |
| Login | typed reactive form, `NonNullableFormBuilder`, `returnUrl` input from query param |
| Checkout | nested `FormGroup`, custom validator, **`canDeactivate`** unsaved-changes guard, `authGuard` |
| Order tracking | RxJS polling (`timer` + `switchMap` + `takeWhile`), `takeUntilDestroyed`, timeline UI |
| Rate order | **Signal Forms** (`form`, `[formField]`, `validate`, `submit`) inside `@defer` |
| Admin dashboard | **`canMatch` role guard** on lazy `loadChildren`, `*appHasRole` directive |
| Cross-cutting | functional interceptors (auth, error/retry, idempotency key, loading), mock-backend interceptor, toasts, env badge |
| Environments | dev / qa / uat / prod via `fileReplacements` + `APP_ENV` token |
| Quality | 52 Vitest tests (incl. interview challenges), Playwright E2E, Docker + Nginx, GitHub Actions |

## Architecture

```mermaid
flowchart TB
    subgraph Browser
      subgraph UI [features/ — lazy routes]
        L[RestaurantListPage] --> RC[RestaurantCard]
        M[RestaurantMenuPage]
        C[CartPage]
        CO[CheckoutPage]
        OT[OrderTrackingPage] --> FB[OrderFeedback<br/>Signal Forms]
        AD[AdminDashboard]
      end
      subgraph State
        CS[(CartStore<br/>signals)]
        AS[(AuthService<br/>signals)]
      end
      subgraph DataAccess [core/api]
        RA[RestaurantApi]
        OA[OrderApi]
      end
      subgraph HTTP [HttpClient + interceptors]
        I1[loading] --> I2[auth] --> I3[idempotency] --> I4[error/retry] --> I5[mock API<br/>dev only]
      end
      L & M --> RA
      CO & OT & AD --> OA
      M & C & CO --> CS
      RA & OA --> I1
    end
    I5 -->|qa/uat/prod| GW[API Gateway<br/>/api/**]
    GW --> RS[restaurant-service]
    GW --> OS[order-service]
    GW --> AUTH[auth / IdP]
```

## Screens

| | |
|---|---|
| ![Menu](../assets/screens/02-menu.png){ .screen } | ![Cart](../assets/screens/03-cart.png){ .screen } |
| ![Login](../assets/screens/04-login.png){ .screen } | ![Checkout](../assets/screens/05-checkout.png){ .screen } |
| ![Tracking](../assets/screens/06-tracking.png){ .screen } | ![Admin](../assets/screens/07-admin.png){ .screen } |

These screenshots were captured by Playwright from the running app.

Continue to [UI Design](ui-design.md), then the [API Contract](api-contract.md) and the [Code Walkthrough](code-walkthrough.md).
