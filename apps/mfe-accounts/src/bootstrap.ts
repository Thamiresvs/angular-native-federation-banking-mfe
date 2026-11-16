import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { AccountsDashboardComponent } from './app/presentation/accounts-dashboard.component';

bootstrapApplication(AccountsDashboardComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
}).catch((err) => console.error(err));
