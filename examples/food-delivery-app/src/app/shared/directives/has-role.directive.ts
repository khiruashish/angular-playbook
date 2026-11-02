import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/models/models';

/**
 * Structural directive for UI-level authorization:
 *   <button *appHasRole="['ADMIN']">Delete</button>
 * The backend must still enforce the same rule — hiding a button is UX, not security.
 */
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  readonly appHasRole = input.required<Role[]>();

  constructor() {
    effect(() => {
      const allowed = this.auth.hasAnyRole(...this.appHasRole());
      this.vcr.clear();
      if (allowed) this.vcr.createEmbeddedView(this.tpl);
    });
  }
}
