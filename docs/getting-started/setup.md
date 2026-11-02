# Install & Setup

## 1. Install Node.js (use a version manager)

=== "macOS / Linux (nvm)"

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    exec $SHELL
    nvm install 24          # Node 24 LTS
    nvm alias default 24
    node -v && npm -v
    ```

=== "Windows (nvm-windows / winget)"

    ```powershell
    winget install CoreyButler.NVMforWindows
    nvm install 24
    nvm use 24
    node -v; npm -v
    ```

=== "Pin per project (.nvmrc)"

    ```bash
    echo "24" > .nvmrc
    nvm use            # picks 24 in this folder
    ```

## 2. Install the Angular CLI

```bash
npm install -g @angular/cli@22
ng version
ng completion           # enables tab-completion for ng in your shell
ng analytics disable    # opt out of usage analytics (optional)
```

## 3. Create a workspace

```bash
ng new food-app \
  --style=scss \
  --routing \
  --ssr=false \
  --prefix=app \
  --package-manager=npm
```

| Flag | Meaning |
|---|---|
| `--style` | `css` \| `scss` \| `sass` \| `less` \| `tailwind` (v21+) |
| `--ssr` | Add `@angular/ssr` (server-side rendering + hydration) |
| `--routing` | Generate `app.routes.ts` |
| `--zoneless` | v20.2+ asks; **default true from v21** |
| `--standalone=false` | Generate the old NgModule style (not recommended) |
| `--skip-tests` / `--skip-git` / `--skip-install` | Self-explanatory |
| `--create-application=false` | Empty workspace for a monorepo with `projects/` |
| `--test-runner` | `vitest` (default v21+) or `karma` |
| `--ai-config` | Generate AI-assistant rule files (Claude, Copilot, Cursor…) (v20.2+) |
| `--dry-run` | Show what would be generated |

## 4. Run it

```bash
cd food-app
ng serve --open          # or: npm start
```

!!! output "Output"
    ```text
    Initial chunk files | Names         |  Raw size
    main.js             | main          | 41.37 kB |
    styles.css          | styles        | 95 bytes |

    Application bundle generation complete. [0.912 seconds]
    Watch mode enabled. Watching for file changes...
      ➜  Local:   http://localhost:4200/
      ➜  press h + enter to show help
    ```

## 5. Editor setup (VS Code)

| Extension | Why |
|---|---|
| **Angular Language Service** | Template type-checking, go-to-definition and autocomplete in HTML |
| ESLint | `ng add @angular-eslint/schematics` adds the config |
| Prettier | Formatting (the CLI generates `.prettierrc` from v20) |
| Playwright Test | Run and debug E2E tests |
| EditorConfig | Respect `.editorconfig` |

```json title=".vscode/settings.json"
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "angular.enable-strict-mode-prompt": false
}
```

## 6. Add the usual libraries

```bash
ng add @angular/material            # Material 3 components + theming
ng add @angular-eslint/schematics   # linting -> ng lint
ng add @angular/ssr                 # SSR + hydration later
ng add @angular/pwa                 # service worker + manifest
ng add @angular/localize            # i18n
npm i @ngrx/signals                 # SignalStore (state management)
npm i angular-oauth2-oidc           # OIDC / OAuth2 + PKCE client
```

## 7. Corporate setups

```bash
npm config set proxy http://proxy.corp:8080
npm config set https-proxy http://proxy.corp:8080
npm config set registry https://artifactory.corp/api/npm/npm-remote/
npm config set strict-ssl true
npm config set cafile /etc/ssl/corp-ca.pem
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `The Angular CLI requires a minimum Node.js version` | `nvm install 24 && nvm use 24` |
| `ng: command not found` | `npm i -g @angular/cli`, or use `npx ng` |
| `ERESOLVE unable to resolve dependency tree` | Align versions with `ng update`. Use `--legacy-peer-deps` only as a last resort |
| Port 4200 busy | `ng serve --port 4300` |
| Stale build cache | `rm -rf .angular/cache` or `ng cache clean` |
| Weird install state | `rm -rf node_modules package-lock.json && npm i` (then commit the new lock file) |
