# Build & Deploy

```mermaid
flowchart LR
    Dev[Developer] -->|PR| CI[CI: npm ci → test → build:qa/uat/prod → e2e]
    CI -->|image food-web:sha| REG[(Container registry)]
    REG --> QA[QA env<br/>build:qa]
    QA -->|smoke e2e OK| UAT[UAT env<br/>build:uat]
    UAT -->|business sign-off + approval| PROD[PROD<br/>build:prod]
    PROD --> CDN[CDN / Nginx]
```

<div class="cards3d">
<a class="tilt" href="environments/"><span class="ico">🌱</span><b>Environments</b><span>dev / qa / uat / prod configs</span></a>
<a class="tilt" href="build/"><span class="ico">🏗️</span><b>Build Commands</b><span>Every flag, output, optimisation</span></a>
<a class="tilt" href="docker-nginx/"><span class="ico">🐳</span><b>Docker &amp; Nginx</b><span>Multi-stage image, SPA fallback, caching</span></a>
<a class="tilt" href="ci-cd/"><span class="ico">🔁</span><b>CI/CD</b><span>GitHub Actions pipeline with promotion</span></a>
<a class="tilt" href="cloud/"><span class="ico">☁️</span><b>Cloud Hosting</b><span>S3+CloudFront, Azure, Firebase, Vercel, K8s</span></a>
</div>
