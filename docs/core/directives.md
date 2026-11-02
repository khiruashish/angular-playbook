# Directives

A directive adds **behaviour** to an existing element. A component is a directive that has a template.

| Kind | Changes | Examples |
|---|---|---|
| **Component** | renders its own view | `<app-card>` |
| **Attribute** | appearance/behaviour of host | `[appHighlight]`, `routerLink`, `ngModel` |
| **Structural** | DOM structure (adds/removes views) | `*appHasRole`, `*ngTemplateOutlet` |

## Attribute directive

```typescript title="highlight.directive.ts"
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '[style.backgroundColor]': 'active() ? color() : null',
  },
})
export class HighlightDirective {
  readonly color = input('yellow', { alias: 'appHighlight' });
  protected readonly active = signal(false);
}
```

```html
<p appHighlight="lightgreen">Hover me</p>
```

!!! output "Output"
    ```text
    <p style="background-color: lightgreen;">Hover me</p>   ← while hovered
    ```

## Structural directive (real one from the food app)

```typescript title="shared/directives/has-role.directive.ts"
--8<-- "src/app/shared/directives/has-role.directive.ts"
```

The `*` is sugar: `<button *appHasRole="['ADMIN']">` becomes
`<ng-template [appHasRole]="['ADMIN']"><button>…</button></ng-template>`.

## Host directives (composition, v15+)

Reuse behaviour without inheritance:

```typescript
@Directive({ selector: '[appTooltip]', host: { '(mouseenter)': 'show()' } })
export class Tooltip { readonly appTooltip = input(''); show() { /* … */ } }

@Component({
  selector: 'app-icon-button',
  hostDirectives: [
    { directive: Tooltip, inputs: ['appTooltip: tip'] },   // expose & rename input
    CdkFocusMonitor,
  ],
  template: `<ng-content />`,
})
export class IconButton {}
```

```html
<app-icon-button tip="Delete">🗑</app-icon-button>
```

## Built-in directives

| Directive | Package | Note |
|---|---|---|
| `NgClass`, `NgStyle` | common | prefer `[class]` / `[style]` |
| `NgTemplateOutlet`, `NgComponentOutlet` | common | dynamic templates and components |
| `NgOptimizedImage` (`ngSrc`) | common | LCP-friendly images ([Performance](../advanced/performance.md)) |
| `NgPlural`, `NgPluralCase` | common | pluralisation |
| `RouterLink`, `RouterLinkActive`, `RouterOutlet` | router | navigation |
| `NgModel`, `FormControlName`, `FormField` | forms | forms |
| `NgIf`, `NgFor`, `NgSwitch` | common | **deprecated v20**, use control flow |

## Interview corner

??? question "Component vs directive: which one do you write?"
    If you need **your own markup**, write a component. If you need to **decorate someone else's element** (focus trap,
    tooltip, permission check, lazy image), write a directive. Directives compose (many per element). Only one
    component can sit on an element.

??? question "How do you get the element a directive sits on?"
    `inject(ElementRef)`, but prefer `host` bindings and `Renderer2` or signals over touching `nativeElement` directly.
    Direct DOM access breaks SSR and web workers.
