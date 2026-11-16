import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthSessionService } from './core/auth-session.service';
import { MFE_EVENTS, TransferCompletedPayload } from '../../../../packages/mfe-contracts/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell-layout">
      <aside class="sidebar">
        <div class="brand">
          <span class="logo-dot"></span>
          <div>
            <h1>FinCore</h1>
            <small>Native Federation MFE</small>
          </div>
        </div>

        <nav class="nav-menu">
          <a routerLink="/accounts" routerLinkActive="active" class="nav-item">
            <span>📊 Accounts & Ledger</span>
            <span class="port-tag">:4201</span>
          </a>
          <a routerLink="/transfers" routerLinkActive="active" class="nav-item">
            <span>⚡ PIX & Transfers</span>
            <span class="port-tag">:4202</span>
          </a>
        </nav>

        <div class="arch-info">
          <p class="arch-title">Runtime Topology</p>
          <ul>
            <li>Host Shell: <code>:4200</code></li>
            <li>ESM Import Maps: <code>Active</code></li>
            <li>Event Bus: <code>Typed CustomEvent</code></li>
          </ul>
        </div>
      </aside>

      <div class="main-wrapper">
        <header class="topbar">
          <div class="account-pill">
            <span>Branch {{ session().branch }}</span>
            <span>•</span>
            <span>Acc <strong>{{ session().accountNumber }}</strong></span>
          </div>
          <div class="user-profile">
            <span class="tier-badge">{{ session().role }}</span>
            <span class="user-name">{{ session().fullName }}</span>
          </div>
        </header>

        @if (lastEventToast()) {
          <div class="event-toast">
            <span>🔔 <strong>Cross-MFE Event Received:</strong> {{ lastEventToast() }}</span>
            <button (click)="lastEventToast.set(null)">✕</button>
          </div>
        }

        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell-layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 260px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border-subtle);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
    .logo-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--accent-primary); box-shadow: 0 0 12px var(--accent-primary); }
    .brand h1 { font-size: 1.2rem; font-weight: 700; }
    .brand small { color: var(--text-secondary); font-size: 0.75rem; display: block; }
    .nav-menu { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .nav-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.15s ease;
    }
    .nav-item:hover { background: var(--bg-surface-elevated); color: var(--text-primary); }
    .nav-item.active { background: rgba(56, 189, 248, 0.12); color: var(--accent-primary); border: 1px solid rgba(56, 189, 248, 0.3); }
    .port-tag { font-size: 0.7rem; background: var(--bg-canvas); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--text-secondary); }
    .arch-info { background: var(--bg-canvas); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 0.78rem; }
    .arch-title { font-weight: 600; margin-bottom: 0.5rem; color: var(--accent-primary); }
    .arch-info ul { list-style: none; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.3rem; }
    .arch-info code { color: var(--text-primary); }
    .main-wrapper { flex: 1; display: flex; flex-direction: column; }
    .topbar {
      height: 64px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .account-pill { display: flex; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); }
    .user-profile { display: flex; align-items: center; gap: 0.75rem; }
    .tier-badge { font-size: 0.7rem; font-weight: 700; background: rgba(16, 185, 129, 0.15); color: var(--accent-success); padding: 0.2rem 0.5rem; border-radius: 4px; }
    .user-name { font-size: 0.9rem; font-weight: 600; }
    .event-toast {
      background: rgba(16, 185, 129, 0.15);
      border-bottom: 1px solid var(--accent-success);
      color: var(--text-primary);
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }
    .event-toast button { background: transparent; border: none; color: var(--text-primary); cursor: pointer; font-size: 1rem; }
    .content-area { padding: 2rem; max-width: 1100px; width: 100%; margin: 0 auto; }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  readonly session = inject(AuthSessionService).session;
  readonly lastEventToast = signal<string | null>(null);

  private readonly transferListener = (event: Event) => {
    const customEvent = event as CustomEvent<TransferCompletedPayload>;
    const { recipientName, amount } = customEvent.detail;
    this.lastEventToast.set(
      `PIX of R$ ${amount.toFixed(2)} to ${recipientName} synced across MFEs.`
    );
  };

  ngOnInit(): void {
    window.addEventListener(MFE_EVENTS.TRANSFER_COMPLETED, this.transferListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener(MFE_EVENTS.TRANSFER_COMPLETED, this.transferListener);
  }
}
