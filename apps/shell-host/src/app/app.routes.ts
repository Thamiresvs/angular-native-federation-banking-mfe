import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { RemoteFallbackComponent } from './presentation/remote-fallback.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
  {
    path: 'accounts',
    loadComponent: () =>
      loadRemoteModule('mfe-accounts', './Component')
        .then((m) => m.AccountsDashboardComponent)
        .catch((err) => {
          console.error('[Shell] Falha ao carregar mfe-accounts:', err);
          return RemoteFallbackComponent;
        }),
    data: { remoteName: 'mfe-accounts (:4201)' },
  },
  {
    path: 'transfers',
    loadComponent: () =>
      loadRemoteModule('mfe-transfers', './Component')
        .then((m) => m.TransfersWizardComponent)
        .catch((err) => {
          console.error('[Shell] Falha ao carregar mfe-transfers:', err);
          return RemoteFallbackComponent;
        }),
    data: { remoteName: 'mfe-transfers (:4202)' },
  },
  {
    path: '**',
    redirectTo: 'accounts',
  },
];
