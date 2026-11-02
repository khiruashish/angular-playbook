# Cheat Sheet

## Component (v22)

```typescript
@Component({
  selector: 'app-x',
  imports: [RouterLink, InrPipe],
  template: `…`,
  styles: `…`,
  host: { class: 'x', '(click)': 'onClick()' },
  // changeDetection: OnPush (default)  |  ChangeDetectionStrategy.Eager to opt out
})
export class X {
  private readonly api = inject(Api);
  readonly id = input.required<string>();
  readonly size = input<'s' | 'm'>('m');
  readonly open = model(false);
  readonly saved = output<Item>();
  readonly box = viewChild.required<ElementRef>('box');
  protected readonly count = signal(0);
  protected readonly double = computed(() => this.count() * 2);
  protected readonly item = httpResource<Item>(() => `/api/items/${this.id()}`);
  constructor() { effect(() => console.log(this.count())); }
}
```

## Template

```html
{{ v }}  [prop]="v"  (event)="fn($event)"  [(model)]="s"  [attr.aria-x]="v"  [class.on]="b"  [style.width.px]="w"  #ref
@if (a) {} @else if (b) {} @else {}
@for (x of xs(); track x.id; let i = $index) {} @empty {}
@switch (s) { @case ('a') {} @default {} }
@let total = cart.total();
@defer (on viewport; prefetch on idle) {} @placeholder {} @loading {} @error {}
<ng-content select="[slot]" />  <ng-template #t let-x>…</ng-template>  <ng-container *ngTemplateOutlet="t; context: {$implicit: 1}" />
```

## Signals

```typescript
const s = signal(0); s.set(1); s.update(v => v + 1); s.asReadonly();
const c = computed(() => s() * 2);
const l = linkedSignal(() => src());                     // writable, resets on source change
effect((onCleanup) => { …; onCleanup(() => …) });
untracked(() => other());
toSignal(obs$, { initialValue: [] });  toObservable(s);
resource({ params: () => …, loader: ({ params, abortSignal }) => fetch(…) });
rxResource({ params: () => …, stream: ({ params }) => http.get(…) });
httpResource<T>(() => url(), { defaultValue });
```

## DI

```typescript
@Injectable({ providedIn: 'root' }) class S {}
inject(T, { optional: true, skipSelf: true, self: true, host: true });
{ provide: T, useClass | useValue | useFactory | useExisting, multi: true }
const TOKEN = new InjectionToken<Cfg>('cfg', { providedIn: 'root', factory: () => cfg });
runInInjectionContext(injector, () => inject(X));
```

## Router

```typescript
provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(PreloadAllModules))
{ path: 'x/:id', loadComponent: () => import('./x'), canActivate: [authGuard], canMatch: [roleGuard('ADMIN')],
  canDeactivate: [unsaved], resolve: { item: itemResolver }, title: 'X', providers: [XStore] }
router.navigate(['/x', id], { queryParams: { q }, queryParamsHandling: 'merge' });
```

## HTTP

```typescript
provideHttpClient(withInterceptors([auth, error]), withFetch() /* default v22 */, withXhr() /* uploads progress */)
export const auth: HttpInterceptorFn = (req, next) => next(req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }));
```

## Forms

```typescript
// Reactive (typed)
fb = inject(NonNullableFormBuilder);
form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
// Signal Forms (v22 stable)
model = signal({ email: '' });
f = form(this.model, (p) => { required(p.email); email(p.email); });
// <input [formField]="f.email" />  f.email().errors()  f().valid()  submit(f, async () => …)
```

## RxJS

```text
switchMap: latest only | mergeMap: parallel | concatMap: queue | exhaustMap: ignore while busy
debounceTime · distinctUntilChanged · catchError · retry({count,delay}) · shareReplay({bufferSize:1,refCount:true})
takeUntilDestroyed(destroyRef) · combineLatest · forkJoin (needs completion) · startWith · scan
```

## Testing

```typescript
TestBed.configureTestingModule({ imports: [C], providers: [provideHttpClient(), provideHttpClientTesting(), { provide: S, useValue: fake }] });
const f = TestBed.createComponent(C); f.componentRef.setInput('x', 1); await f.whenStable();
TestBed.inject(HttpTestingController).expectOne('/api/x').flush(data);
TestBed.runInInjectionContext(() => guard(route, state));
TestBed.tick();               // flush effects
vi.fn(); vi.spyOn(o, 'm').mockReturnValue(of(x)); vi.useFakeTimers();
```

## CLI

```bash
ng new app --style=scss --ssr=false        ng serve -o                 ng g c|s|d|p|g|r|i name
ng build -c production|qa|uat|development  ng test --watch=false --coverage
ng add @angular/material|ssr|pwa|localize  ng update @angular/core@22 @angular/cli@22
ng g @angular/core:control-flow|signals|inject|standalone|route-lazy-loading
ng extract-i18n   ng lint   ng deploy   ng cache clean   ng version
```
