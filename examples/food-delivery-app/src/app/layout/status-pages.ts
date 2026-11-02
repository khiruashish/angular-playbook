import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterLink],
  template: `<section class="card center"><h1>403</h1><p>You don't have access to this page.</p><a routerLink="/">Home</a></section>`,
})
export class ForbiddenPage {}

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `<section class="card center"><h1>404</h1><p>Page not found.</p><a routerLink="/">Home</a></section>`,
})
export class NotFoundPage {}
