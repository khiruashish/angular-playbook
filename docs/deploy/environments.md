# Environments: dev, qa, uat, prod

| Env | Purpose | API | Optimised | Source maps | Mock API | Log level |
|---|---|---|---|---|---|---|
| **dev** | local `ng serve` | `/api` (mock or proxy) | no | yes | ✅ | debug |
| **qa** | testers, automated E2E | `api.qa.food.example.com` | yes | yes (debuggable) | ❌ | info |
| **uat** | business sign-off, prod-like | `api.uat.food.example.com` | yes | hidden (upload to Sentry) | ❌ | warn |
| **prod** | customers | `api.food.example.com` | yes | hidden / none | ❌ | error |

## Approach 1: build-time `fileReplacements` (used by the food app)

```bash
ng g environments     # creates src/environments/environment.ts + environment.development.ts
```

```typescript title="src/environments/environment.model.ts"
--8<-- "src/environments/environment.model.ts"
```

=== "environment.ts (dev, default)"

    ```typescript
    --8<-- "src/environments/environment.ts"
    ```

=== "environment.qa.ts"

    ```typescript
    --8<-- "src/environments/environment.qa.ts"
    ```

=== "environment.uat.ts"

    ```typescript
    --8<-- "src/environments/environment.uat.ts"
    ```

=== "environment.prod.ts"

    ```typescript
    --8<-- "src/environments/environment.prod.ts"
    ```

```json title="angular.json → build.configurations"
"production": {
  "fileReplacements": [{ "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }],
  "budgets": [ … ], "outputHashing": "all"
},
"uat": {
  "fileReplacements": [{ "replace": "src/environments/environment.ts", "with": "src/environments/environment.uat.ts" }],
  "outputHashing": "all", "sourceMap": { "scripts": true, "hidden": true }
},
"qa": {
  "fileReplacements": [{ "replace": "src/environments/environment.ts", "with": "src/environments/environment.qa.ts" }],
  "optimization": true, "outputHashing": "all", "sourceMap": true, "namedChunks": true
},
"development": { "optimization": false, "extractLicenses": false, "sourceMap": true }
```

```json title="angular.json → serve.configurations"
"development": { "buildTarget": "food-delivery-app:build:development", "proxyConfig": "proxy.conf.json" },
"qa":  { "buildTarget": "food-delivery-app:build:qa" },
"uat": { "buildTarget": "food-delivery-app:build:uat" }
```

```bash
npm start                          # dev (mock API)
npm run start:qa                   # serve the qa config locally
npm run build:qa                   # ng build --configuration qa
npm run build:uat
npm run build:prod
```

Code always imports the **base** file. The build swaps it:

```typescript title="core/config.ts"
--8<-- "src/app/core/config.ts"
```

The header shows a coloured badge with the environment name everywhere except prod (`@if (env.name !== 'prod')`),
so testers always know where they are.

## Approach 2: runtime config ("build once, deploy many")

With build-time replacement you build **one artefact per environment**. Many teams prefer **one image promoted
through all environments**, so the artefact tested in QA is byte-for-byte what goes to prod.

```typescript title="main.ts"
fetch('/config.json')
  .then((r) => r.json() as Promise<AppEnvironment>)
  .then((config) => bootstrapApplication(App, {
    ...appConfig,
    providers: [...appConfig.providers, { provide: APP_ENV, useValue: config }],
  }));
```

```bash title="docker-entrypoint.sh: render config from container env vars"
cat > /usr/share/nginx/html/config.json <<JSON
{ "name": "${APP_ENV}", "production": ${PRODUCTION:-true}, "apiBaseUrl": "${API_BASE_URL}",
  "useMockApi": false, "auth": { "issuer": "${OIDC_ISSUER}", "clientId": "${OIDC_CLIENT_ID}" },
  "featureFlags": { "liveTracking": true, "newCheckout": ${NEW_CHECKOUT:-false} }, "logLevel": "${LOG_LEVEL:-error}" }
JSON
exec nginx -g 'daemon off;'
```

```bash
docker run -e APP_ENV=qa -e API_BASE_URL=https://api.qa.food.example.com … food-web:1.4.2
docker run -e APP_ENV=prod -e API_BASE_URL=https://api.food.example.com … food-web:1.4.2   # same image!
```

| | fileReplacements | Runtime config.json |
|---|---|---|
| Artefacts | one per env | **one for all** |
| Tree-shaking per env (e.g. drop mock code) | ✅ | ❌ |
| Change config without rebuild | ❌ | ✅ |
| Extra request at startup | no | yes (~1 small JSON) |
| Best for | simple pipelines, static hosting | Kubernetes, strict "promote the same artefact" policies |

!!! danger "Config is public"
    Both approaches ship config to the browser. Never put secrets there.

## Interview corner

??? question "How do you set up dev/qa/uat/prod in Angular?"
    Create an environment file per env with a shared interface, add a build configuration per env in `angular.json` with
    `fileReplacements` (plus env-specific optimisation, source maps and budgets), add matching serve configurations and
    npm scripts, and inject the config via an `InjectionToken`. For build-once-deploy-many, load `config.json` before
    bootstrap instead.

??? question "Why does `ng build` produce a production build by default?"
    `defaultConfiguration: "production"` in the build target. `ng serve` defaults to `development`.
