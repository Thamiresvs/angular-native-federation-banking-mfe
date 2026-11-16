import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { TransfersWizardComponent } from './app/presentation/transfers-wizard.component';

bootstrapApplication(TransfersWizardComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
}).catch((err) => console.error(err));
