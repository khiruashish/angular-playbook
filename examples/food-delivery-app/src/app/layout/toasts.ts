import { Component, inject } from '@angular/core';
import { LoadingService } from '../shared/ui/loading.service';
import { NotificationService } from '../shared/ui/notification.service';

@Component({
  selector: 'app-toasts',
  template: `
    @if (loading.isLoading()) { <div class="progress" role="progressbar" aria-label="Loading"></div> }
    <div class="toasts" aria-live="polite">
      @for (t of notify.toasts(); track t.id) {
        <div class="toast" [class]="t.kind" (click)="notify.dismiss(t.id)">{{ t.text }}</div>
      }
    </div>
  `,
  styles: `
    .progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--brand); animation: p 1s infinite; z-index: 100; }
    @keyframes p { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); } }
    .toasts { position: fixed; bottom: 16px; right: 16px; display: grid; gap: 8px; z-index: 100; }
    .toast { padding: 12px 16px; border-radius: 10px; color: #fff; background: #334155; box-shadow: var(--shadow-lg); cursor: pointer; }
    .toast.success { background: #15803d; } .toast.error { background: #b91c1c; }
  `,
})
export class Toasts {
  protected readonly notify = inject(NotificationService);
  protected readonly loading = inject(LoadingService);
}
