import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-remote-fallback',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fallback-card">
      <div class="badge">CIRCUIT BREAKER ACTIVE</div>
      <h2>Micro Frontend Temporarily Unavailable</h2>
      <p>
        The remote module <strong>{{ remoteName }}</strong> could not be resolved at runtime.
        Other banking modules remain fully operational.
      </p>
      <div class="actions">
        <button (click)="reloadPage()" class="btn-primary">Retry Connection</button>
        <a routerLink="/accounts" class="btn-secondary">Back to Accounts</a>
      </div>
    </div>
  `,
  styles: [`
    .fallback-card {
      background: var(--bg-surface);
      border: 1px solid var(--accent-warning);
      border-radius: 12px;
      padding: 2rem;
      max-width: 560px;
      margin: 2rem auto;
    }
    .badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.15);
      color: var(--accent-warning);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }
    h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    p { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; }
    .actions { display: flex; gap: 0.75rem; }
    .btn-primary, .btn-secondary {
      padding: 0.6rem 1.1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      border: none;
    }
    .btn-primary { background: var(--accent-primary); color: #0f172a; }
    .btn-secondary { background: var(--bg-surface-elevated); color: var(--text-primary); }
  `]
})
export class RemoteFallbackComponent {
  private readonly route = inject(ActivatedRoute);
  readonly remoteName = this.route.snapshot.data['remoteName'] ?? 'Unknown MFE';

  reloadPage(): void {
    window.location.reload();
  }
}
