# Beginner Questions

??? question "1. What is Angular, and how is it different from AngularJS?"
    Angular (2+) is a TypeScript-based, component-oriented framework from Google for building SPAs. It includes a
    router, forms, HTTP, DI, testing and a CLI. AngularJS (1.x) was a JavaScript MVC framework built on scopes,
    controllers and two-way digest-cycle binding. Angular rewrote everything: components instead of controllers,
    hierarchical DI, an AOT compiler, unidirectional data flow, and (since v16) signals. AngularJS reached end of life in Dec 2021.

??? question "2. What are Node.js, npm and the Angular CLI used for?"
    Node.js runs the build tooling. npm installs packages and runs scripts. The Angular CLI (`ng`) scaffolds, serves,
    builds, tests and updates projects. See [Node.js, npm & ng](../getting-started/node-npm-ng.md).

??? question "3. What is a component?"
    A class decorated with `@Component` that controls a part of the UI through its template and styles.
    ```typescript
    @Component({ selector: 'app-hello', template: `<h1>Hello {{ name() }}</h1>` })
    export class Hello { name = signal('Angular'); }
    ```
    Output: `Hello Angular`

??? question "4. What is a standalone component?"
    A component that declares its own template dependencies in `imports` instead of being declared in an NgModule.
    It's the default since v17 for new apps, and `standalone: true` is implicit since v19.

??? question "5. Explain the four kinds of data binding."
    Interpolation `{{ }}` and property `[prop]` go class → view. Event `(event)` goes view → class.
    Two-way `[(x)]` is property + event combined.
    ```html
    <input [value]="name()" (input)="name.set($any($event.target).value)" /> {{ name() }}
    ```

??? question "6. What is the difference between an attribute and a property binding?"
    Properties are DOM object fields (`input.value`, `disabled`). Attributes are HTML markup (`aria-*`, `colspan`).
    Use `[attr.aria-label]` for attributes that have no matching property.

??? question "7. What are directives? Name the three types."
    Components (with a template), attribute directives (change appearance or behaviour: `ngModel`, `routerLink`) and
    structural directives (change DOM layout: `*ngTemplateOutlet`, or custom ones like `*appHasRole`).

??? question "8. What is the new control flow syntax?"
    Built-in template blocks (v17+): `@if/@else`, `@for (… ; track …) / @empty`, `@switch/@case/@default`, `@let`
    and `@defer`. They replace `*ngIf`, `*ngFor` and `ngSwitch` (deprecated in v20) and don't need `CommonModule`.

??? question "9. Why is `track` required in `@for`?"
    So Angular can identify items across changes and reuse DOM nodes instead of recreating them. Use a unique id.

??? question "10. What is a service and why use one?"
    A class (usually `@Injectable({ providedIn: 'root' })`) holding reusable logic or state: API calls, auth, a cart.
    Components stay thin, logic is shared and testable, and DI provides the instance.

??? question "11. What is dependency injection?"
    A design pattern where a class receives its dependencies from outside rather than creating them.
    `private api = inject(RestaurantApi)`. Angular's injector creates and caches instances. It enables loose coupling
    and easy test fakes.

??? question "12. What does `providedIn: 'root'` mean?"
    The service is registered in the root injector: one singleton for the app, created lazily, and tree-shaken if unused.

??? question "13. What are pipes? Give examples."
    Template transformers: `{{ price | currency:'INR' }}`, `{{ d | date:'short' }}`, `{{ name | uppercase }}`,
    `{{ obs$ | async }}`. Custom pipes implement `PipeTransform`.

??? question "14. What is the `async` pipe?"
    It subscribes to an Observable or Promise in the template, returns the latest value, marks for check on emission
    and unsubscribes on destroy.

??? question "15. How do you pass data from parent to child?"
    With an input: `readonly item = input.required<Item>()` in the child and `<app-child [item]="x" />` in the parent.

??? question "16. How do you send data from child to parent?"
    With an output: `readonly saved = output<Item>()`, then `this.saved.emit(item)` in the child and `(saved)="onSaved($event)"` in the parent.

??? question "17. What are lifecycle hooks? Name the common ones."
    Callbacks Angular invokes at specific moments: `ngOnChanges`, `ngOnInit`, `ngDoCheck`, `ngAfterContentInit`,
    `ngAfterViewInit`, `ngOnDestroy`. Plus the newer `afterNextRender` / `afterEveryRender`.

??? question "18. Constructor vs ngOnInit?"
    The constructor is for DI and initialisation. Inputs aren't set yet. `ngOnInit` runs once after the first inputs
    are set, which makes it the place to start loading data.

??? question "19. What is the Angular Router?"
    A service and set of directives that map URLs to components, supporting nested routes, parameters, lazy loading,
    guards and resolvers. Configure it with `provideRouter(routes)` and render with `<router-outlet />`.

??? question "20. How do you navigate programmatically?"
    `inject(Router).navigate(['/orders', id])` or `navigateByUrl('/orders/o1')`.

??? question "21. How do you read a route parameter?"
    Bind it as an input with `withComponentInputBinding()` (`readonly id = input<string>()`), or use
    `inject(ActivatedRoute).snapshot.paramMap.get('id')` / `.paramMap` observable.

??? question "22. What is lazy loading?"
    Loading a route's code only when it's visited: `loadComponent: () => import('./cart.page').then(m => m.CartPage)`.
    It shrinks the initial bundle.

??? question "23. What is `ng-content`?"
    A slot for **content projection**. The parent passes markup between the child's tags, and the child decides where
    it renders. `select` gives multiple named slots.

??? question "24. `ng-template` vs `ng-container`?"
    `ng-template` defines a template that isn't rendered until something instantiates it. `ng-container` groups
    elements without adding a DOM node.

??? question "25. What is a template reference variable?"
    `#name` on an element gives the template a reference to it (or to a directive via `#f="ngForm"`):
    `<input #q /> <button (click)="search(q.value)">`.

??? question "26. Template-driven vs reactive forms?"
    Template-driven: the model lives in the template (`ngModel`), which suits simple forms. Reactive: an explicit
    `FormGroup`/`FormControl` model in the class, typed, testable and good for complex or dynamic forms. v22 adds
    stable **Signal Forms** (`form(signal)`).

??? question "27. How do you make an HTTP GET request?"
    ```typescript
    private http = inject(HttpClient);
    restaurants = toSignal(this.http.get<Restaurant[]>('/api/restaurants'), { initialValue: [] });
    ```
    Register `provideHttpClient()` in `app.config.ts`.

??? question "28. What is `angular.json`?"
    The workspace configuration: projects, builders and build configurations (production, qa…), assets, styles,
    budgets, and serve/test targets.

??? question "29. What does `ng build` produce?"
    Optimised static files in `dist/<app>/browser` (index.html, hashed JS chunks, CSS, assets) ready to deploy.

??? question "30. What is `ng serve`?"
    A dev server (Vite) with incremental rebuilds and HMR at `http://localhost:4200`.

??? question "31. What is TypeScript and why does Angular use it?"
    A typed superset of JavaScript. Types catch errors at compile time, enable IDE tooling and refactoring, and
    decorators and metadata power Angular's compiler. Angular 22 requires TS 6.0.

??? question "32. What is a decorator?"
    A function that attaches metadata to a class or member: `@Component`, `@Injectable`, `@Input`, `@Pipe`, `@Directive`.

??? question "33. What is `main.ts`?"
    The entry point that bootstraps the app: `bootstrapApplication(App, appConfig)`.

??? question "34. What are environments?"
    Per-environment config files (dev, qa, uat, prod) swapped at build time via `fileReplacements`.
    See [Environments](../deploy/environments.md).

??? question "35. What is a signal?"
    A reactive value container: `count = signal(0)`. Read with `count()`, write with `set`/`update`. Templates and
    `computed` automatically re-run when it changes.

??? question "36. What is `computed`?"
    A read-only signal derived from others, cached until a dependency changes:
    `total = computed(() => price() * qty())`.

??? question "37. What is `@defer`?"
    Lazy-loads part of a template on a trigger (`on viewport`, `on idle`, `on interaction`…) with optional
    `@placeholder`, `@loading` and `@error` blocks.

??? question "38. How do you add a CSS class conditionally?"
    `[class.active]="isActive()"`, or `[class]="{ active: isActive(), disabled: off() }"`.

??? question "39. What's view encapsulation?"
    Scoping of component styles. Emulated (the default) rewrites selectors with unique attributes. ShadowDom uses
    native shadow roots. None makes styles global.

??? question "40. What does `*` mean in `*appHasRole`?"
    Syntactic sugar for wrapping the element in `<ng-template [appHasRole]>`, so the directive controls whether it's rendered.

??? question "41. What is a guard?"
    A function the router calls to decide whether navigation may proceed (`canActivate`, `canMatch`,
    `canDeactivate`…). It returns `true`, `false` or a redirect `UrlTree`.

??? question "42. What is an interceptor?"
    A function in the HttpClient pipeline that can modify requests and responses: add auth headers, handle errors,
    show loaders. Register with `withInterceptors([...])`.

??? question "43. How do you create a component with the CLI?"
    `ng g c features/cart/cart-page`. Add `--skip-tests`, `--inline-template` or `--dry-run` as needed.

??? question "44. What is `package-lock.json`?"
    The exact resolved dependency tree. Commit it, and use `npm ci` in CI for reproducible installs.

??? question "45. What is the difference between `dependencies` and `devDependencies`?"
    Runtime packages (Angular, RxJS) vs build and test tools (CLI, TypeScript, Vitest). For browser bundles only
    imported code ships either way. The distinction matters for libraries and SSR servers.
