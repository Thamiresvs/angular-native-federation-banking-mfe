import { Injectable, signal, computed } from '@angular/core';
import { BankTransaction, MFE_EVENTS, TransferCompletedPayload } from '../../../../../packages/mfe-contracts/index';

const INITIAL_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'tx-1001',
    date: '2026-11-15T14:20:00Z',
    description: 'Enterprise Architecture Consulting',
    counterparty: 'GOOGLE Tecnologia S.A.',
    category: 'TED',
    type: 'CREDIT',
    amount: 18500.00,
    status: 'COMPLETED',
  },
  {
    id: 'tx-1002',
    date: '2026-11-14T09:15:00Z',
    description: 'Cloud Infrastructure & Azure DevOps',
    counterparty: 'Microsoft Brasil Ltda',
    category: 'PAYMENT',
    type: 'DEBIT',
    amount: 640.50,
    status: 'COMPLETED',
  },
  {
    id: 'tx-1003',
    date: '2026-11-12T18:45:00Z',
    description: 'Instant PIX Transfer',
    counterparty: 'Studio Design System',
    category: 'PIX',
    type: 'DEBIT',
    amount: 1200.00,
    status: 'COMPLETED',
  },
];

@Injectable({ providedIn: 'root' })
export class AccountsLedgerFacade {
  private readonly _transactions = signal<BankTransaction[]>(INITIAL_TRANSACTIONS);
  readonly filterType = signal<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  readonly filteredTransactions = computed(() => {
    const filter = this.filterType();
    const list = this._transactions();
    if (filter === 'ALL') return list;
    return list.filter((tx) => tx.type === filter);
  });

  readonly currentBalance = computed(() =>
    this._transactions().reduce(
      (acc, tx) => (tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount),
      0
    )
  );

  readonly totalCredits = computed(() =>
    this._transactions()
      .filter((t) => t.type === 'CREDIT')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  readonly totalDebits = computed(() =>
    this._transactions()
      .filter((t) => t.type === 'DEBIT')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  constructor() {
    window.addEventListener(MFE_EVENTS.TRANSFER_COMPLETED, (event: Event) => {
      const payload = (event as CustomEvent<TransferCompletedPayload>).detail;
      this.recordOutgoingPix(payload);
    });
  }

  recordOutgoingPix(payload: TransferCompletedPayload): void {
    const newTx: BankTransaction = {
      id: payload.transactionId,
      date: payload.timestamp,
      description: payload.description || 'PIX Outgoing Transfer',
      counterparty: payload.recipientName,
      category: 'PIX',
      type: 'DEBIT',
      amount: payload.amount,
      status: 'COMPLETED',
    };
    this._transactions.update((prev) => [newTx, ...prev]);
  }
}
