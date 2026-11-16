import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AccountsLedgerFacade } from '../application/accounts-ledger.facade';

@Component({
  selector: 'app-accounts-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mfe-container">
      <header class="mfe-header">
        <div>
          <span class="remote-pill">REMOTE MFE • mfe-accounts (:4201)</span>
          <h2>Checking Account & Ledger</h2>
        </div>
      </header>

      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <span class="kpi-label">Available Balance</span>
          <strong class="kpi-value">{{ facade.currentBalance() | currency:'BRL' }}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Monthly Inflow</span>
          <strong class="kpi-value credit">+ {{ facade.totalCredits() | currency:'BRL' }}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Monthly Outflow</span>
          <strong class="kpi-value debit">- {{ facade.totalDebits() | currency:'BRL' }}</strong>
        </div>
      </div>

      <div class="ledger-card">
        <div class="ledger-toolbar">
          <h3>Statement History</h3>
          <div class="filter-group">
            <button [class.active]="facade.filterType() === 'ALL'" (click)="facade.filterType.set('ALL')">All</button>
            <button [class.active]="facade.filterType() === 'CREDIT'" (click)="facade.filterType.set('CREDIT')">Credits</button>
            <button [class.active]="facade.filterType() === 'DEBIT'" (click)="facade.filterType.set('DEBIT')">Debits</button>
          </div>
        </div>

        <table class="tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Counterparty / Description</th>
              <th>Channel</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (tx of facade.filteredTransactions(); track tx.id) {
              <tr>
                <td class="muted">{{ tx.date | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <div class="tx-party">{{ tx.counterparty }}</div>
                  <div class="tx-desc">{{ tx.description }}</div>
                </td>
                <td><span class="channel-tag">{{ tx.category }}</span></td>
                <td class="right" [class.credit]="tx.type === 'CREDIT'" [class.debit]="tx.type === 'DEBIT'">
                  {{ tx.type === 'CREDIT' ? '+' : '-' }} {{ tx.amount | currency:'BRL' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .mfe-header { margin-bottom: 1.5rem; }
    .remote-pill { font-size: 0.7rem; font-weight: 700; color: var(--accent-primary); letter-spacing: 0.05em; }
    h2 { font-size: 1.5rem; margin-top: 0.25rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .kpi-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem; }
    .kpi-card.highlight { border-color: var(--accent-primary); background: linear-gradient(145deg, var(--bg-surface), rgba(56, 189, 248, 0.08)); }
    .kpi-label { font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 0.4rem; }
    .kpi-value { font-size: 1.4rem; font-weight: 700; }
    .credit { color: var(--accent-success); }
    .debit { color: var(--accent-danger); }
    .ledger-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.5rem; }
    .ledger-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .filter-group { display: flex; gap: 0.4rem; }
    .filter-group button {
      background: var(--bg-canvas);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .filter-group button.active { background: var(--accent-primary); color: #0f172a; font-weight: 600; border-color: var(--accent-primary); }
    .tx-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .tx-table th { text-align: left; color: var(--text-secondary); font-weight: 500; padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border-subtle); }
    .tx-table td { padding: 0.85rem 0.5rem; border-bottom: 1px solid rgba(51, 65, 85, 0.5); }
    .tx-table .right { text-align: right; font-weight: 600; }
    .muted { color: var(--text-secondary); font-size: 0.82rem; }
    .tx-party { font-weight: 600; }
    .tx-desc { font-size: 0.8rem; color: var(--text-secondary); }
    .channel-tag { background: var(--bg-canvas); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid var(--border-subtle); }
  `]
})
export class AccountsDashboardComponent {
  readonly facade = inject(AccountsLedgerFacade);
}
