# Angular Playbook

A senior-engineer playbook for **Angular 17 → 22** (22.2 is the latest stable release), built as a **MkDocs Material**
site with a custom 3D theme. It covers every core and advanced topic with code, output, sequence diagrams and
220+ interview questions, plus a **complete, tested food-delivery app**.

📖 **Read the playbook online: https://khiruashish.github.io/angular-playbook/**

## What's here

```text
docs/                       MkDocs content (≈50 pages)
  getting-started/          Node.js, npm, ng, setup, every CLI command, project structure, versions 17→22
  core/                     components, templates, directives, pipes, DI, lifecycle, CD, styling, routing, forms, HTTP
  reactivity/               signals, RxJS, state management (signal stores, NgRx SignalStore, NgRx Store)
  security/                 authentication (OIDC+PKCE, JWT, BFF), authorization (roles/permissions), web security
  advanced/                 performance, SSR & hydration, animations, i18n, a11y, PWA, errors, libraries, MFE, workers
  testing/                  Vitest unit + component tests, Playwright E2E
  deploy/                   environments (dev/qa/uat/prod), build commands, Docker & Nginx, CI/CD, cloud
  case-study/               food-delivery UI design, API contract, code walkthrough (+ real screenshots)
  interview/                beginner → expert questions + coding challenges with verified output
  stylesheets/3d.css        3D theme (perspective cards, depth shadows, rotating hero cube)
  javascripts/tilt.js       mouse-follow tilt for cards
examples/food-delivery-app  Angular 22.2 app: zoneless, signals, httpResource, Signal Forms, guards, interceptors
.github/workflows/          app-ci.yml (test/build/e2e/docker) · docs.yml (mkdocs --strict → GitHub Pages)
```

## Run the docs

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve                 # http://127.0.0.1:8000
mkdocs build --strict        # static site in ./site
```

## Run the app

```bash
cd examples/food-delivery-app
npm ci
npm start                    # http://localhost:4200 (mock API, demo users customer@food.dev / admin@food.dev, password "password")
npm run test:ci              # 52 Vitest tests + coverage
npm run e2e                  # Playwright end-to-end
npm run build:qa | build:uat | build:prod
docker build --build-arg CONFIGURATION=production -t food-web . && docker run -p 8080:8080 food-web
```

## Publishing the site

The site is live at **https://khiruashish.github.io/angular-playbook/**.

`.github/workflows/docs.yml` builds with `--strict` on every PR and redeploys to **GitHub Pages** on pushes to `main`
(Pages source is set to **GitHub Actions** in the repo settings). It can also be run manually from the Actions tab.
