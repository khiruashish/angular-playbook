# Web Workers & Angular Elements

## Web Workers

```bash
ng g web-worker features/restaurants/fuzzy-search
```

```typescript title="fuzzy-search.worker.ts"
/// <reference lib="webworker" />
addEventListener('message', ({ data }: MessageEvent<{ q: string; names: string[] }>) => {
  const q = data.q.toLowerCase();
  const scored = data.names
    .map((n) => ({ n, score: [...q].reduce((s, ch) => (n.toLowerCase().includes(ch) ? s + 1 : s), 0) }))
    .sort((a, b) => b.score - a.score);
  postMessage(scored.slice(0, 5).map((x) => x.n));
});
```

```typescript
const worker = new Worker(new URL('./fuzzy-search.worker', import.meta.url), { type: 'module' });
worker.onmessage = ({ data }) => this.suggestions.set(data);
worker.postMessage({ q: 'spce', names: ['Spice Route', 'Green Leaf', 'Space Burgers'] });
```

!!! output "Output"
    ```text
    ['Spice Route', 'Space Burgers', 'Green Leaf']
    ```

Use workers for CPU-heavy work (parsing, search, image processing) to keep INP low. Workers have no DOM access.

## Angular Elements (Custom Elements)

```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

const app = await createApplication({ providers: [provideHttpClient()] });
customElements.define('food-rating', createCustomElement(RatingBadge, { injector: app.injector }));
```

```html
<!-- in any page: WordPress, React, plain HTML -->
<food-rating rating="4.5"></food-rating>
```

Inputs map to attributes and properties (kebab-cased), and outputs become `CustomEvent`s.
