export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  counterparty: string;
  category: 'PIX' | 'TED' | 'SALARY' | 'PAYMENT';
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  status: 'COMPLETED' | 'PENDING';
}

export interface TransferCompletedPayload {
  transactionId: string;
  recipientName: string;
  pixKey: string;
  amount: number;
  timestamp: string;
  description?: string;
}

export interface UserSessionContext {
  userId: string;
  fullName: string;
  accountNumber: string;
  branch: string;
  role: 'RETAIL' | 'PRIVATE_BANKING';
  token: string;
}

export const MFE_EVENTS = {
  TRANSFER_COMPLETED: 'fincore:transfer-completed',
  BALANCE_SYNC_REQUESTED: 'fincore:balance-sync-requested',
} as const;

export function dispatchMfeEvent<T>(eventName: string, detail: T): void {
  window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
}
