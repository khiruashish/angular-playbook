# Libraries & Monorepos

## Angular CLI multi-project workspace

```bash
ng new platform --create-application=false
cd platform
ng g application food-web
ng g application admin-web
ng g library ui-kit --prefix=ui
ng build ui-kit                         # ng-packagr → dist/ui-kit (APF format)
```

```typescript title="projects/ui-kit/src/public-api.ts"
export * from './lib/button/button';
export * from './lib/rating/rating-badge';
```

Apps import via a tsconfig path, so no npm publish is needed inside the workspace:

```json
"paths": { "ui-kit": ["./dist/ui-kit"] }
```

### Secondary entry points (better tree-shaking)

```text
projects/ui-kit/
  button/ng-package.json + public-api.ts   → import { Button } from 'ui-kit/button'
  dialog/ng-package.json + public-api.ts   → import { Dialog } from 'ui-kit/dialog'
```

### Publishing

```bash
ng build ui-kit -c production
cd dist/ui-kit && npm publish --access public    # or to a private registry
```

## Nx (for larger monorepos)

```bash
npx create-nx-workspace@latest food --preset=angular-monorepo
nx g @nx/angular:library libs/orders/data-access
nx affected -t lint test build                  # only what changed
nx graph                                         # dependency graph
```

Nx adds computation caching (local and remote), `affected` commands, and **module-boundary lint rules**:

```json
"@nx/enforce-module-boundaries": ["error", { "depConstraints": [
  { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:ui", "type:data-access", "type:util"] },
  { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:util"] }
]}]
```

## Library design rules

- Expose `provideX()` functions, not `forRoot()` modules.
- Keep peerDependencies on `@angular/*` with a compatible range (`^22.0.0`).
- No side effects at import time, and `"sideEffects": false` in package.json.
- Don't depend on app code. Use InjectionTokens for configuration.
