# Angular CLI Command Reference

All commands below were checked against **@angular/cli 22.2**. Aliases are in brackets.

## Workspace

| Command | Purpose |
|---|---|
| `ng new <name>` `[n]` | Create a workspace and app |
| `ng new <name> --create-application=false` | Empty multi-project workspace |
| `ng generate application admin` `[g app]` | Add a second app under `projects/` |
| `ng generate library ui-kit` `[g lib]` | Add a publishable library |
| `ng config <json-path> [value]` | Read or write `angular.json` (e.g. `ng config cli.packageManager pnpm`) |
| `ng version` `[v]` | Versions of CLI, framework and Node |
| `ng analytics disable` | Opt out of telemetry |
| `ng completion` | Shell autocompletion |
| `ng cache clean` / `ng cache info` / `ng cache disable` | Manage the persistent build cache in `.angular/cache` |

### `ng new` flags (v22)

```text
--style=css|scss|sass|less|tailwind   --routing   --ssr   --zoneless   --standalone
--test-runner=vitest|karma   --ai-config=claude,copilot,cursor,gemini,…   --file-name-style-guide=2016|2025
--minimal   --strict   --view-encapsulation=Emulated|None|ShadowDom   --package-manager=npm|pnpm|yarn|bun
--prefix=app   --inline-style  --inline-template  --skip-tests  --skip-git  --skip-install  --directory  --dry-run
```

## Generate (`ng g`)

```bash
ng g component features/cart/cart-page       # [c]  component (ts + html + scss + spec)
ng g c shared/ui/badge --inline-template --inline-style --skip-tests
ng g c orders --change-detection=Eager       # opt out of the OnPush default (v22)
ng g directive shared/has-role               # [d]
ng g pipe shared/inr                         # [p]
ng g service core/api/restaurant-api         # [s]
ng g guard core/auth/auth --functional       # [g]  prompts for CanActivate / CanMatch / CanDeactivate…
ng g interceptor core/http/auth              # functional interceptor
ng g resolver features/menu/menu             # [r]
ng g interface core/models/order             # [i]
ng g enum core/models/order-status           # [e]
ng g class core/money                        # [cl]
ng g environments                            # creates src/environments + fileReplacements
ng g config karma | browserslist | vitest    # eject a default config file
ng g web-worker features/search/fuzzy        # web worker + tsconfig.worker.json
ng g service-worker                          # @angular/service-worker setup
ng g app-shell                               # prerendered app shell
ng g ai-config                               # AGENTS.md / CLAUDE.md + Angular MCP server config
ng g module legacy --routing                 # [m]  NgModule (legacy codebases only)
ng g @ngrx/signals:signal-store cart         # third-party schematic (collection:schematic)
```

Add `--dry-run` (`-d`) to any generate command to preview it.

## Develop

```bash
ng serve                              # [s, dev]  http://localhost:4200, HMR on
ng serve -o --port 4300 --host 0.0.0.0
ng serve --configuration qa           # serve with the qa build config
ng serve --proxy-config proxy.conf.json
ng serve --ssl                        # https dev server (self-signed)
ng serve --no-hmr                     # full reloads instead of hot module replacement
```

## Build

```bash
ng build                              # [b]  production by default (defaultConfiguration)
ng build -c development               # unminified, source maps
ng build -c qa | uat | production     # your custom configurations
ng build --base-href /food/           # app served from a sub-path
ng build --stats-json                 # writes stats.json for bundle analysis
ng build --watch -c development
ng build --localize                   # one build per locale (i18n)
ng build ui-kit                       # build a library (ng-packagr)
```

## Test & Quality

```bash
ng test                               # [t]  Vitest in watch mode (v21+ default)
ng test --watch=false                 # single run (CI)
ng test --coverage                    # coverage report (needs @vitest/coverage-v8)
ng test --include "src/app/features/cart/**"
ng test --browsers chromium           # run in a real browser (Vitest browser mode + playwright)
ng lint                               # needs @angular-eslint (ng add @angular-eslint/schematics)
ng e2e                                # runs the configured e2e builder (ng add playwright-ng-schematics)
```

## Update & Migrate

```bash
ng update                                         # list available updates
ng update @angular/core@22 @angular/cli@22        # one major at a time!
ng update @angular/material@22
ng update @angular/cli --name use-application-builder   # run one named migration

# Modernisation schematics (names verified in @angular/core 22 collection.json)
ng g @angular/core:standalone                     # NgModules → standalone (run 3 modes in order)
ng g @angular/core:control-flow                   # *ngIf/*ngFor/*ngSwitch → @if/@for/@switch
ng g @angular/core:signals                        # all three below in one go
ng g @angular/core:signal-input                   # @Input → input()
ng g @angular/core:outputs                        # @Output → output()
ng g @angular/core:signal-queries                 # @ViewChild/@ContentChild → viewChild()/contentChild()
ng g @angular/core:inject                         # constructor DI → inject()
ng g @angular/core:route-lazy-loading             # eager component routes → loadComponent
ng g @angular/core:self-closing-tag               # <x></x> → <x />
ng g @angular/core:ngclass-to-class               # [ngClass] → [class.x]
ng g @angular/core:ngstyle-to-style               # [ngStyle] → [style.x]
ng g @angular/core:common-to-standalone           # CommonModule → individual imports
ng g @angular/core:cleanup-unused-imports         # remove unused standalone imports
ng g @angular/core:router-testing-module-migration # RouterTestingModule → provideRouter
```

!!! tip "Upgrade rule of thumb"
    Go **one major at a time** (17 → 18 → 19 …), commit after each `ng update`, and follow the checklist at
    [update.angular.dev](https://update.angular.dev). Never jump several majors in one step.

## Add / Deploy / i18n

```bash
ng add @angular/material | @angular/ssr | @angular/pwa | @angular/localize | @angular-eslint/schematics
ng add @angular/fire                  # Firebase hosting + ng deploy
ng deploy                             # runs the deploy builder you added
ng extract-i18n --output-path src/locale
ng run food-app:build:production      # run any architect target explicitly
```

## npm scripts used in the example app

```json title="examples/food-delivery-app/package.json"
--8<-- "package.json:4:18"
```
