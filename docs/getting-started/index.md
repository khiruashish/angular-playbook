# Getting Started

This section takes you from an empty laptop to a running Angular 22 app, and explains every tool along the way.

<div class="cards3d">
<a class="tilt" href="node-npm-ng/"><span class="ico">🟩</span><b>Node.js, npm &amp; ng</b><span>What each tool is and why Angular needs it</span></a>
<a class="tilt" href="setup/"><span class="ico">⚙️</span><b>Install &amp; Setup</b><span>Windows / macOS / Linux, nvm, IDE, first app</span></a>
<a class="tilt" href="cli-commands/"><span class="ico">⌨️</span><b>CLI Reference</b><span>Every ng / npm / npx command you'll use</span></a>
<a class="tilt" href="project-structure/"><span class="ico">🗂️</span><b>Project Structure</b><span>Every generated file explained</span></a>
<a class="tilt" href="versions/"><span class="ico">🗓️</span><b>Versions 17 → 22</b><span>Feature timeline and migration guide</span></a>
</div>

## The 60-second version

```bash
nvm install 24 && nvm use 24          # Node.js LTS (Angular 22 needs ^22.22.3 || ^24.15.0 || >=26)
npm install -g @angular/cli@22         # gives you the `ng` command
ng new my-app --style=scss --ssr=false # scaffold (zoneless, standalone, Vitest by default)
cd my-app && ng serve -o               # dev server on http://localhost:4200 with HMR
```

```mermaid
sequenceDiagram
    autonumber
    actor Dev
    participant CLI as ng (Angular CLI)
    participant NPM as npm registry
    participant Build as @angular/build (esbuild + Vite)
    participant Browser
    Dev->>CLI: ng new my-app
    CLI->>NPM: npm install (@angular/*, typescript, vitest)
    NPM-->>CLI: node_modules/
    Dev->>CLI: ng serve
    CLI->>Build: compile TS + templates (AOT)
    Build-->>Browser: serve bundles @ :4200
    Dev->>Build: save file
    Build-->>Browser: HMR patch (no full reload)
