import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { dispatchMfeEvent, MFE_EVENTS, TransferCompletedPayload } from '@fincore/mfe-contracts';

@Component({
  selector: 'app-transfers-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mfe-container">
      <header class="mfe-header">
        <span class="remote-pill">REMOTE MFE • mfe-transfers (:4202)</span>
        <h2>Instant PIX Transfer</h2>
        <p class="subtitle">
          Submitting a transfer dispatches a typed <code>CustomEvent</code> across the Micro Frontend boundary.
        </p>
      </header>

      <div class="wizard-card">
        <form [formGroup]="transferForm" (ngSubmit)="submitTransfer()">
          <div class="form-group">
            <label for="recipientName">Recipient Name</label>
            <input id="recipientName" type="text" formControlName="recipientName" placeholder="e.g. Ana Beatriz Silva" />
          </div>

          <div class="form-group">
            <label for="pixKey">PIX Key (CPF, Email, or Random Key)</label>
            <input id="pixKey" type="text" formControlName="pixKey" placeholder="e.g. ana.silva@bank.com" />
          </div>

          <div class="form-group">
            <label for="amount">Amount (BRL)</label>
            <input id="amount" type="number" step="0.01" formControlName="amount" placeholder="250.00" />
          </div>

          <div class="form-group">
            <label for="description">Description (Optional)</label>
            <input id="description" type="text" formControlName="description" placeholder="Sprint delivery milestone" />
          </div>

          <button type="submit" class="btn-submit" [disabled]="transferForm.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Authorizing Transaction...' : 'Confirm & Send PIX' }}
          </button>
        </form>

        @if (receipt()) {
          <div class="receipt-box">
            <h4>✅ PIX Authorized & Broadcasted</h4>
            <p><strong>Transaction ID:</strong> {{ receipt()!.transactionId }}</p>
            <p><strong>Recipient:</strong> {{ receipt()!.recipientName }}</p>
            <p><strong>Amount:</strong> {{ receipt()!.amount | currency:'BRL' }}</p>
            <small>Navigate to <strong>Accounts & Ledger</strong> to verify real-time balance synchronization.</small>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .mfe-header { margin-bottom: 1.5rem; }
    .remote-pill { font-size: 0.7rem; font-weight: 700; color: #c084fc; letter-spacing: 0.05em; }
    h2 { font-size: 1.5rem; margin-top: 0.25rem; }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }
    .wizard-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.75rem; max-width: 560px; }
    .form-group { margin-bottom: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem; }
    label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
    input {
      background: var(--bg-canvas);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 0.7rem 0.9rem;
      color: var(--text-primary);
      font-size: 0.95rem;
    }
    input:focus { outline: none; border-color: var(--accent-primary); }
    .btn-submit {
      width: 100%;
      background: var(--accent-success);
      color: #0f172a;
      font-weight: 700;
      padding: 0.85rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .receipt-box {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--accent-success);
      border-radius: 8px;
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .receipt-box h4 { color: var(--accent-success); margin-bottom: 0.25rem; }
  `]
})
export class TransfersWizardComponent {
  private readonly fb = inject(FormBuilder);
  readonly isSubmitting = signal(false);
  readonly receipt = signal<TransferCompletedPayload | null>(null);

  readonly transferForm = this.fb.nonNullable.group({
    recipientName: ['', [Validators.required, Validators.minLength(3)]],
    pixKey: ['', [Validators.required]],
    amount: [150, [Validators.required, Validators.min(1)]],
    description: [''],
  });

  submitTransfer(): void {
    if (this.transferForm.invalid) return;
    this.isSubmitting.set(true);

    const raw = this.transferForm.getRawValue();
    const payload: TransferCompletedPayload = {
      transactionId: `PIX-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientName: raw.recipientName,
      pixKey: raw.pixKey,
      amount: Number(raw.amount),
      timestamp: new Date().toISOString(),
      description: raw.description,
    };

    setTimeout(() => {
      dispatchMfeEvent<TransferCompletedPayload>(MFE_EVENTS.TRANSFER_COMPLETED, payload);
      this.receipt.set(payload);
      this.isSubmitting.set(false);
      this.transferForm.reset({ recipientName: '', pixKey: '', amount: 150, description: '' });
    }, 350);
  }
}
