# Node.js, npm, npx & ng

Angular apps run **in the browser**, but the *tooling* that builds them runs on **Node.js**.
That split is the most common confusion for newcomers.

```mermaid
flowchart LR
    subgraph Your machine / CI
      N[Node.js runtime] --> NPM[npm<br/>package manager]
      NPM --> NM[(node_modules)]
      N --> NG[ng CLI<br/>@angular/cli]
      NG --> B[@angular/build<br/>esbuild + Vite]
      B --> D[(dist/ — static<br/>HTML/JS/CSS)]
    end
    D -->|deploy| S[Nginx / CDN / S3]
    S -->|download| BR[Browser runs your app]
```

## Node.js

**What:** a JavaScript runtime built on Chrome's V8 engine that runs JS *outside* the browser (file system, network, processes).

**Why Angular needs it:** the CLI, the TypeScript compiler, the Angular compiler (`ngc`), esbuild, Vite, Vitest and Playwright are all Node programs.
Your **production app does not need Node** unless you use SSR. A client-side app is just static files.

| Angular | Supported Node.js | TypeScript |
|---|---|---|
| 17 | ^18.13 \|\| ^20.9 | 5.2 – 5.4 |
| 18 | ^18.19 \|\| ^20.11 \|\| ^22 | 5.4 – 5.5 |
| 19 | ^18.19 \|\| ^20.11 \|\| ^22 | 5.5 – 5.8 |
| 20 | ^20.19 \|\| ^22.12 \|\| ^24 | 5.8 |
| 21 | ^20.19 \|\| ^22.12 \|\| ^24 | 5.9 |
| **22** | **^22.22.3 \|\| ^24.15 \|\| >=26** | **6.0** |

```bash
node -v      # v24.x
node -e "console.log(process.versions.v8)"
```

!!! output "Output"
    ```text
    v24.15.0
    13.6.233.10-node.32
    ```

## npm

**What:** *Node Package Manager*. It does three jobs:

1. **Registry client:** downloads packages from `registry.npmjs.org`.
2. **Dependency manager:** resolves the tree into `node_modules/` and pins exact versions in `package-lock.json`.
3. **Script runner:** `npm run <script>` runs the commands in `package.json → scripts`.

```json title="package.json (excerpt)"
{
  "scripts": {
    "start": "ng serve",
    "build:prod": "ng build --configuration production",
    "test": "ng test"
  },
  "dependencies":    { "@angular/core": "^22.2.0", "rxjs": "~7.8.0" },
  "devDependencies": { "@angular/cli": "^22.2.5", "typescript": "~6.0.2", "vitest": "^5.0.0" }
}
```

**Semver ranges:** `^22.2.0` allows `22.x.x` at or above 22.2.0. `~7.8.0` allows `7.8.x` only. `22.2.0` is exact.

| Command | What it does |
|---|---|
| `npm install` / `npm i` | Install everything in package.json (updates the lock file if needed) |
| `npm ci` | **Clean install, exactly from the lock file.** Use this in CI and Docker |
| `npm i rxjs@7.8.2` | Add a runtime dependency |
| `npm i -D vitest` | Add a dev dependency |
| `npm uninstall lodash` | Remove a package |
| `npm outdated` / `npm update` | List / apply allowed upgrades |
| `npm ls @angular/core` | Show the resolved version in the tree |
| `npm run <script>` | Run a script (`npm start` and `npm test` are shortcuts) |
| `npm audit` / `npm audit fix` | Check / fix vulnerable dependencies |
| `npm view @angular/core version` | Latest published version |
| `npm cache clean --force` | Fix a corrupted cache |
| `npm config set registry <url>` | Use a private registry (Artifactory / Nexus) |

!!! warning "`dependencies` vs `devDependencies`"
    For a browser app the distinction is mostly documentation, because the bundler only includes what you `import`.
    For **libraries** and **SSR servers** it matters: only `dependencies` get installed by consumers or in production images.

## npx

Runs a package binary **without installing it globally**:

```bash
npx @angular/cli@22 new demo        # use CLI v22 once, without a global install
npx ng version                      # use the project-local CLI from node_modules/.bin
npx playwright test
```

## ng: the Angular CLI

`ng` is the binary from `@angular/cli`. It **scaffolds, serves, builds, tests and updates** Angular workspaces,
reading its configuration from `angular.json`. The actual compiling is done by *builders*
(`@angular/build:application`, `:dev-server`, `:unit-test`).

```bash
ng version
```

!!! output "Output"
    ```text
    Angular CLI       : 22.2.5
    Angular           : 22.2.4
    Node.js           : 24.15.0
    Package Manager   : npm 10.9.9
    Operating System  : linux x64

    Package                     Version
    @angular/build              22.2.5
    @angular/core               22.2.4
    rxjs                        7.8.2
    typescript                  6.0.3
    vitest                      5.1.0
    ```

!!! tip "Global vs local CLI"
    A global `ng` just forwards to the **project-local** `node_modules/@angular/cli` when you run it inside a workspace.
    So each project always uses its own pinned version. In CI, prefer `npx ng …` or `npm run …`.

## Other package managers

| | npm | pnpm | yarn (berry) | bun |
|---|---|---|---|---|
| Install | `npm ci` | `pnpm i --frozen-lockfile` | `yarn install --immutable` | `bun install --frozen-lockfile` |
| Disk use | full copy per project | content-addressed store (smallest) | PnP / node_modules | fast, global cache |
| Use with ng | default | `ng new --package-manager=pnpm` | `--package-manager=yarn` | `--package-manager=bun` |

## Interview quick-fire

??? question "Q: Does an Angular app need Node.js in production?"
    Only if you use **SSR** (`@angular/ssr`, an Express or Node server). A CSR build produces static files that any web server or CDN can host.

??? question "Q: `npm install` vs `npm ci`?"
    `npm ci` deletes `node_modules`, installs **exactly** what's in `package-lock.json`, and **fails** if package.json and the lock file disagree. It's reproducible and faster, so use it in CI and Docker.
    `npm install` may update the lock file.

??? question "Q: What is `package-lock.json` for, and should it be committed?"
    It records the exact resolved version and integrity hash of every transitive dependency, so builds are reproducible. **Always commit it.**
