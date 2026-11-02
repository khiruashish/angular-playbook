# Web Security

## XSS (Cross-Site Scripting)

Angular **escapes everything by default**. Interpolation and property bindings treat values as untrusted.

```typescript
comment = `<img src=x onerror="alert('xss')"> <b>bold</b>`;
```

```html
<p>{{ comment }}</p>             <!-- rendered as TEXT -->
<p [innerHTML]="comment"></p>    <!-- sanitized: <img> loses onerror, <b> kept -->
```

!!! output "Output"
    ```text
    <p>&lt;img src=x onerror="alert('xss')"&gt; &lt;b&gt;bold&lt;/b&gt;</p>
    <p><img src="x"> <b>bold</b></p>
    console: WARNING: sanitizing HTML stripped some content
    ```

### Bypassing (only for trusted content!)

```typescript
private readonly sanitizer = inject(DomSanitizer);
trustedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${safeId}`);
```

Never pass user input to `bypassSecurityTrust*`, `ElementRef.nativeElement.innerHTML`, `document.write`, or `eval`.

### Trusted Types + CSP

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
  require-trusted-types-for 'script'; trusted-types angular angular#bundler;
```

Angular supports Trusted Types natively. Turn on `autoCsp` (v19+) in `angular.json` to have the build generate
hash-based CSP for inline scripts:

```json
"security": { "autoCsp": true }
```

## CSRF / XSRF

Only relevant when you authenticate with **cookies** (BFF, session). HttpClient reads the `XSRF-TOKEN` cookie and sends
an `X-XSRF-TOKEN` header on mutating same-origin requests. The server compares the two.

```typescript
provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))
```

Bearer tokens in the `Authorization` header aren't sent automatically by the browser, so they aren't CSRF-prone.

## CORS

CORS is enforced by the **browser** and configured on the **server**. In development, avoid CORS entirely with the CLI proxy:

```json title="proxy.conf.json"
{ "/api": { "target": "http://localhost:8080", "secure": false, "changeOrigin": true } }
```

In production, serve the SPA and API under one origin behind a gateway or Nginx, or allow-list exact origins on the API
(never `*` with credentials).

## Security headers (set by Nginx/CDN)

```nginx
add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.food.example.com" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;                  # clickjacking (or CSP frame-ancestors 'none')
add_header Referrer-Policy strict-origin-when-cross-origin always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Permissions-Policy "geolocation=(self), camera=()" always;
```

## Secrets

!!! danger "There are no secrets in a front-end bundle"
    `environment.prod.ts`, `.env` files baked at build time and runtime `config.json` are all **public**. API keys
    in the SPA must be restricted (by domain, quota or scope) or proxied through a backend.

## Dependency hygiene

```bash
npm audit --omit=dev
npx better-npm-audit audit --level high
ng update                          # stay on supported Angular versions (security patches)
```

Also: Dependabot or Renovate, lockfile review, `npm ci` in CI, and SRI for third-party CDN scripts.

## Checklist

- [x] No `bypassSecurityTrust*` with user data
- [x] CSP + Trusted Types (or `autoCsp`)
- [x] Tokens: OIDC + PKCE or BFF cookies. Never long-lived tokens in localStorage
- [x] Token only sent to own API (interceptor allow-list)
- [x] All authZ re-checked server side
- [x] HTTPS everywhere + HSTS
- [x] `npm audit` in CI, supported Angular version
- [x] No secrets in the bundle

## Interview corner

??? question "How does Angular prevent XSS, and when can it still happen?"
    Contextual auto-escaping plus sanitisation of HTML, style, URL and resource-URL bindings. It can still happen if you
    bypass the sanitizer with untrusted data, write to the DOM directly (`nativeElement.innerHTML`), use server-side
    template injection (rendering user content into `index.html`), or load compromised third-party scripts.

??? question "What's the difference between XSS and CSRF?"
    XSS: the attacker runs **their script in your origin**, so it can do anything the user can.
    CSRF: the attacker's site makes the **browser send a request with the user's cookies** to your site. Defend against
    XSS with escaping, CSP and Trusted Types. Defend against CSRF with SameSite cookies and XSRF tokens.
