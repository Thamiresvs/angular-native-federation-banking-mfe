import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'mfe-accounts': 'http://localhost:4201/remoteEntry.json',
  'mfe-transfers': 'http://localhost:4202/remoteEntry.json',
})
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[Shell] Erro ao inicializar Native Federation:', err));
