import { Injectable, signal } from '@angular/core';
import { UserSessionContext } from '../../../../../packages/mfe-contracts/index';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  readonly session = signal<UserSessionContext>({
    userId: 'usr-98412',
    fullName: 'Thamires Vasconcelos',
    accountNumber: '0048291-7',
    branch: '0001 - Digital Banking',
    role: 'PRIVATE_BANKING',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.fincore-demo-token',
  });
}
