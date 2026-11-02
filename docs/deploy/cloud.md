# Cloud Hosting Options

| Target | CSR | SSR | How |
|---|---|---|---|
| **AWS S3 + CloudFront** | ✅ | via Lambda@Edge / ECS | `aws s3 sync`, CloudFront 403/404 → `/index.html` (200) |
| **Azure Static Web Apps** | ✅ | ✅ (Functions) | GitHub Action `Azure/static-web-apps-deploy`, `staticwebapp.config.json` navigationFallback |
| **Firebase Hosting** | ✅ | ✅ (App Hosting) | `ng add @angular/fire` → `ng deploy` |
| **Vercel / Netlify** | ✅ | ✅ | auto-detect Angular, `_redirects: /* /index.html 200` |
| **Kubernetes (EKS/AKS/GKE)** | ✅ | ✅ | Nginx image (CSR) or Node image (SSR) + Ingress |
| **GitHub Pages** | ✅ | ❌ | `ng build --base-href /repo/`, copy `index.html` → `404.html` |

## SPA fallback on each platform

=== "CloudFront"

    Custom error responses: 403 and 404 → `/index.html`, response code **200**.

=== "Azure SWA"

    ```json title="staticwebapp.config.json"
    { "navigationFallback": { "rewrite": "/index.html", "exclude": ["/assets/*", "*.{css,js,png,svg}"] } }
    ```

=== "Netlify"

    ```text title="public/_redirects"
    /*  /index.html  200
    ```

=== "Firebase"

    ```json title="firebase.json"
    { "hosting": { "public": "dist/food-delivery-app/browser", "rewrites": [{ "source": "**", "destination": "/index.html" }] } }
    ```

## SSR deployment

```bash
ng build                                   # produces dist/app/browser + dist/app/server
node dist/food-delivery-app/server/server.mjs   # PORT=4000 by default
```

Containerise with `node:22-alpine`, run behind a CDN that caches prerendered and public SSR pages, and scale horizontally.
