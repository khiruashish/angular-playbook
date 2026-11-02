import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/models/models';
import { HasRoleDirective } from './has-role.directive';

@Component({
  imports: [HasRoleDirective],
  template: `<button *appHasRole="['ADMIN']">Delete</button>`,
})
class Host {}

describe('HasRoleDirective', () => {
  const roles = signal<Role[]>([]);

  beforeEach(() => {
    roles.set([]);
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [{ provide: AuthService, useValue: { hasAnyRole: (...r: Role[]) => r.some((x) => roles().includes(x)) } }],
    });
  });

  it('hides content without the role and shows it reactively when granted', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    roles.set(['ADMIN']);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')?.textContent).toBe('Delete');
  });
});
