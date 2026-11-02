---
hide:
  - navigation
  - toc
---

<div class="hero" markdown>
<div markdown>

# Angular Playbook

A field guide written from **15 years of shipping front-ends**, from AngularJS through Angular 22.
Each concept comes with **runnable code, its output, a sequence diagram where the flow matters, and the interview questions** that test it.
It ends with a **complete food-delivery app** that is built, tested and deployed.

[Start here :material-rocket-launch:](getting-started/index.md){ .md-button .md-button--primary }
[Interview prep :material-account-tie:](interview/index.md){ .md-button }
[Food app :material-food:](case-study/index.md){ .md-button }

</div>
<div class="cube-wrap"><div class="cube">
<div class="f1">17</div><div class="f2">18</div><div class="f3">19</div><div class="f4">20</div><div class="f5">21</div><div class="f6">22</div>
</div></div>
</div>

## What's inside

<div class="cards3d">
<a class="tilt" href="getting-started/"><span class="ico">🧰</span><b>Getting Started</b><span>Node.js, npm, ng, install, every CLI command, project anatomy</span></a>
<a class="tilt" href="getting-started/versions/"><span class="ico">🗓️</span><b>Angular 17 → 22</b><span>What changed in each release and how to migrate</span></a>
<a class="tilt" href="core/"><span class="ico">🧱</span><b>Core Concepts</b><span>Components, templates, DI, lifecycle, routing, forms, HTTP</span></a>
<a class="tilt" href="reactivity/"><span class="ico">⚡</span><b>Signals &amp; RxJS</b><span>signal, computed, effect, linkedSignal, resource, state management</span></a>
<a class="tilt" href="security/"><span class="ico">🔐</span><b>Auth &amp; Security</b><span>OIDC + PKCE, JWT, guards, roles, XSS, CSRF, CSP</span></a>
<a class="tilt" href="advanced/"><span class="ico">🚀</span><b>Advanced</b><span>Performance, SSR, hydration, i18n, a11y, PWA, micro frontends</span></a>
<a class="tilt" href="testing/"><span class="ico">🧪</span><b>Testing</b><span>Vitest, TestBed, HttpTestingController, harnesses, Playwright</span></a>
<a class="tilt" href="deploy/"><span class="ico">📦</span><b>Build &amp; Deploy</b><span>dev / qa / uat / prod, Docker, Nginx, CI/CD, cloud</span></a>
<a class="tilt" href="case-study/"><span class="ico">🍔</span><b>Food Delivery App</b><span>UI design, REST API contract, full source code walkthrough</span></a>
<a class="tilt" href="interview/"><span class="ico">🎯</span><b>Interview Questions</b><span>220+ questions from beginner to architect, with code and output</span></a>
</div>

## How to read this playbook

| You are… | Read in this order |
|---|---|
| **New to Angular** | Getting Started → Core Concepts → Signals → Food App |
| **Upgrading from 14–16** | [Versions 17 → 22](getting-started/versions.md) → [Signals](reactivity/signals.md) → [Change Detection](core/change-detection.md) |
| **Preparing for interviews** | [Interview](interview/index.md) → [Coding Challenges](interview/coding-challenges.md) → [Cheat Sheet](cheatsheet.md) |
| **Tech lead / architect** | [Best Practices](advanced/best-practices.md) → [Performance](advanced/performance.md) → [Security](security/index.md) → [Deploy](deploy/index.md) |

!!! tip "The code is real"
    Every snippet in the [Food Delivery App](case-study/index.md) chapter comes from
    `examples/food-delivery-app`, a working **Angular 22.2** project. It builds for dev/qa/uat/prod,
    has **52 unit tests (Vitest)** and **Playwright E2E tests**, and ships with a Dockerfile and Nginx config.

    ```bash
    cd examples/food-delivery-app && npm ci && npm start   # http://localhost:4200
    ```

## Conventions used

- **Angular 22** (latest stable) is the baseline. Version-specific notes are marked `v17+`, `v19+`, and so on.
- File names follow the 2025+ style guide (`login.page.ts`, `app.ts`), not `*.component.ts`.
- Every runnable example is followed by an **Output** block:

!!! output "Output"
    ```text
    This is what the code prints or renders.
    ```
