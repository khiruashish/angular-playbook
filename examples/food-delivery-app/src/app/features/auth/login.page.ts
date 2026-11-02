import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="card login">
      <h1>Sign in</h1>
      <p class="hint">Demo users: <code>customer&#64;food.dev</code> / <code>admin&#64;food.dev</code> — password <code>password</code></p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Email
          <input type="email" formControlName="email" autocomplete="username" />
        </label>
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <small class="err">Enter a valid email</small>
        }
        <label>Password
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>
        @if (error()) { <small class="err" role="alert">{{ error() }}</small> }
        <button class="btn primary" type="submit" [disabled]="form.invalid || busy()">
          {{ busy() ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </section>
  `,
  styles: `
    .login { max-width: 420px; margin: 40px auto; }
    form { display: grid; gap: 12px; }
    label { display: grid; gap: 4px; font-weight: 600; }
    .hint { color: var(--muted); font-size: 13px; }
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Bound from ?returnUrl= via withComponentInputBinding() */
  readonly returnUrl = input<string>('/');

  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.busy.set(true);
    this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigateByUrl(this.returnUrl() || '/'),
      error: () => {
        this.error.set('Invalid email or password');
        this.busy.set(false);
      },
    });
  }
}
