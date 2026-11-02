# Styling & View Encapsulation

## Encapsulation modes

| Mode | How | Leaks out? | Leaks in? |
|---|---|---|---|
| `Emulated` (default) | adds `_ngcontent-xyz` attributes and rewrites selectors | no | global styles yes |
| `ShadowDom` | real Shadow DOM | no | no (only CSS vars and `::part`) |
| `None` | styles become global | **yes** | yes |

```typescript
@Component({
  selector: 'app-badge',
  template: `<span class="badge"><ng-content /></span>`,
  styles: `
    :host { display: inline-block; }                 /* the <app-badge> element */
    :host(.danger) .badge { background: crimson; }   /* host has class danger */
    :host-context(.dark) .badge { color: white; }    /* any ancestor has .dark */
    .badge { background: var(--badge-bg, #16a34a); border-radius: 6px; padding: 2px 6px; }
  `,
})
export class Badge {}
```

!!! output "Rendered DOM (Emulated)"
    ```html
    <app-badge _nghost-ng-c123 class="danger">
      <span _ngcontent-ng-c123 class="badge">New</span>
    </app-badge>
    <style>.badge[_ngcontent-ng-c123]{…}</style>
    ```

## Theming with CSS custom properties

The food app themes everything from `:root` variables, and dark mode is just a media query
(`examples/food-delivery-app/src/styles.scss`).

```scss
:root { --brand: #fc8019; --surface: #fff; }
@media (prefers-color-scheme: dark) { :root { --surface: #1e293b; } }
```

## `::ng-deep`

Deprecated but still supported. Pierces encapsulation to style children you don't own.
Prefer CSS variables, `::part()` (Shadow DOM), or a global stylesheet scoped by a host class.

## Angular Material 3 theming

```scss
@use '@angular/material' as mat;
html {
  @include mat.theme((color: (primary: mat.$orange-palette, theme-type: light dark), typography: Inter, density: 0));
}
```

## Tailwind CSS (v21: `ng new --style=tailwind`)

```bash
npm i -D tailwindcss @tailwindcss/postcss
echo '{ "plugins": { "@tailwindcss/postcss": {} } }' > .postcssrc.json
echo '@import "tailwindcss";' >> src/styles.css
```

```html
<button class="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">Order</button>
```

## Interview corner

??? question "Why do my component styles not apply to `innerHTML` content?"
    Emulated encapsulation adds attributes only to elements **Angular** creates from the template. Elements inserted via
    `[innerHTML]` don't get `_ngcontent-*`. Style them globally, with `:host ::ng-deep`, or render through the template.

??? question "Budget error: `anyComponentStyle exceeded maximum budget`?"
    A component stylesheet is over the `angular.json` budget (4 kB warn / 8 kB error by default). Move shared styles
    to global or utility CSS, or raise the budget deliberately.
