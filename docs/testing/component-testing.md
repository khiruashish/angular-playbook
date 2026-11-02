# Component & Integration Testing

## Signal inputs + outputs + DOM

```typescript title="features/restaurants/restaurant-card.spec.ts"
--8<-- "src/app/features/restaurants/restaurant-card.spec.ts"
```

Key APIs:

| API | Purpose |
|---|---|
| `TestBed.createComponent(C)` | create the component (standalone, so `imports: [C]`) |
| `fixture.componentRef.setInput('name', v)` | set **signal or decorator** inputs (triggers CD) |
| `await fixture.whenStable()` | wait for zoneless CD, effects, pending tasks |
| `fixture.detectChanges()` | synchronous CD (still works) |
| `fixture.nativeElement` / `debugElement.query(By.css())` | DOM access |
| `componentInstance.someOutput.subscribe(spy)` | assert outputs |

## Reactive form through the DOM (with a fake service)

```typescript title="features/auth/login.page.spec.ts"
--8<-- "src/app/features/auth/login.page.spec.ts"
```

## Signal Forms

```typescript title="features/orders/order-feedback.spec.ts"
--8<-- "src/app/features/orders/order-feedback.spec.ts"
```

## Testing a structural directive with a host component

```typescript title="shared/directives/has-role.directive.spec.ts"
--8<-- "src/app/shared/directives/has-role.directive.spec.ts"
```

## Component harnesses (Angular CDK / Material)

Harnesses give a stable, implementation-agnostic API over components:

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

const loader = TestbedHarnessEnvironment.loader(fixture);
const email = await loader.getHarness(MatInputHarness.with({ selector: '[type=email]' }));
await email.setValue('customer@food.dev');
const submit = await loader.getHarness(MatButtonHarness.with({ text: 'Sign in' }));
expect(await submit.isDisabled()).toBe(true);
```

You can write your own `ComponentHarness` for design-system components, so tests survive markup refactors.

## Router testing

```typescript
import { RouterTestingHarness } from '@angular/router/testing';

TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(), provideHttpClientTesting()] });
const harness = await RouterTestingHarness.create();
const page = await harness.navigateByUrl('/restaurants/r1', RestaurantMenuPage);
expect(page.id()).toBe('r1');
```

## Interview corner

??? question "`detectChanges()` vs `whenStable()` in zoneless tests?"
    `detectChanges()` synchronously runs CD once. `whenStable()` waits until the app is stable: scheduled CD,
    effects and pending tasks such as `httpResource` or router navigation. In zoneless apps, prefer `await whenStable()`.
    It mirrors real scheduling and catches missing notifications (e.g. a field that should've been a signal).

??? question "Shallow vs deep component tests?"
    Deep (real children) gives more confidence and is the default for standalone. Shallow means overriding imports with
    stubs via `TestBed.overrideComponent(C, { set: { imports: [StubChild] } })`. Use it only to isolate heavy or
    third-party children.
