import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  const login = vi.fn();

  beforeEach(() => {
    login.mockReset();
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: { login } }],
    });
  });

  async function setup() {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const type = (sel: string, v: string) => {
      const input = el.querySelector(sel) as HTMLInputElement;
      input.value = v;
      input.dispatchEvent(new Event('input'));
    };
    return { fixture, el, type };
  }

  it('disables submit until the form is valid', async () => {
    const { fixture, el, type } = await setup();
    const btn = el.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    type('input[type=email]', 'customer@food.dev');
    type('input[type=password]', 'password');
    await fixture.whenStable();
    expect(btn.disabled).toBe(false);
  });

  it('navigates to returnUrl on success', async () => {
    login.mockReturnValue(of({}));
    const { fixture, el, type } = await setup();
    fixture.componentRef.setInput('returnUrl', '/checkout');
    const nav = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    type('input[type=email]', 'customer@food.dev');
    type('input[type=password]', 'password');
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    expect(login).toHaveBeenCalledWith('customer@food.dev', 'password');
    expect(nav).toHaveBeenCalledWith('/checkout');
  });

  it('shows an error on failure', async () => {
    login.mockReturnValue(throwError(() => new Error('401')));
    const { fixture, el, type } = await setup();
    type('input[type=email]', 'x@y.z');
    type('input[type=password]', 'wrongpw');
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(el.querySelector('[role=alert]')?.textContent).toContain('Invalid email or password');
  });
});
