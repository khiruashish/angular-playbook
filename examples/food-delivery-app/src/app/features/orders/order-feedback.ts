import { Component, output, signal } from '@angular/core';
import { FormField, form, maxLength, min, max, required, submit, validate } from '@angular/forms/signals';

export interface Feedback {
  rating: number;
  comment: string;
  tip: number;
}

/**
 * Signal Forms (stable in v22): the model IS a signal; form() derives a FieldTree with
 * per-field signals (value, valid, errors, touched…). No FormGroup/FormControl classes.
 */
@Component({
  selector: 'app-order-feedback',
  imports: [FormField],
  template: `
    <form class="card" (submit)="$event.preventDefault(); send()">
      <h3>Rate your order</h3>
      <label>Rating (1–5) <input type="number" [formField]="f.rating" /></label>
      @for (e of f.rating().errors(); track e.kind) { <small class="err">{{ e.message }}</small> }

      <label>Comment <textarea [formField]="f.comment" rows="2"></textarea></label>
      @for (e of f.comment().errors(); track e.kind) { <small class="err">{{ e.message }}</small> }

      <label>Tip for rider (₹) <input type="number" [formField]="f.tip" /></label>
      @for (e of f.tip().errors(); track e.kind) { <small class="err">{{ e.message }}</small> }

      <button class="btn primary" type="submit" [disabled]="f().invalid() || f().submitting()">Send feedback</button>
    </form>
  `,
  styles: `form { display: grid; gap: 8px; max-width: 420px; margin-top: 16px; } label { display: grid; gap: 4px; }`,
})
export class OrderFeedback {
  readonly sent = output<Feedback>();

  protected readonly model = signal<Feedback>({ rating: 5, comment: '', tip: 0 });

  protected readonly f = form(this.model, (p) => {
    required(p.rating, { message: 'Rating is required' });
    min(p.rating, 1, { message: 'Minimum 1 star' });
    max(p.rating, 5, { message: 'Maximum 5 stars' });
    maxLength(p.comment, 200, { message: 'Max 200 characters' });
    min(p.tip, 0, { message: 'Tip cannot be negative' });
    // cross-field rule: low ratings must explain why
    validate(p.comment, ({ value, valueOf }) =>
      valueOf(p.rating) <= 2 && value().trim().length < 10
        ? { kind: 'explain', message: 'Please tell us what went wrong (10+ chars)' }
        : undefined,
    );
  });

  protected async send(): Promise<void> {
    await submit(this.f, async (field) => {
      this.sent.emit(field().value());
      return undefined; // no server-side errors
    });
  }
}
