# Security

**Authentication (AuthN)** answers *who are you?* **Authorization (AuthZ)** answers *what may you do?*

!!! danger "The golden rule"
    **Everything in the browser can be read and changed by the user.** Angular guards, hidden buttons and role checks
    are **UX**. The **API must enforce** every authorization rule. A front-end without back-end checks is not secure.

<div class="cards3d">
<a class="tilt" href="authentication/"><span class="ico">🔑</span><b>Authentication</b><span>OIDC + PKCE, JWT, BFF, refresh, interceptors</span></a>
<a class="tilt" href="authorization/"><span class="ico">🛡️</span><b>Authorization</b><span>Roles, permissions, guards, directives</span></a>
<a class="tilt" href="web-security/"><span class="ico">🧱</span><b>Web Security</b><span>XSS, CSRF, CSP, Trusted Types, CORS, secrets</span></a>
</div>
