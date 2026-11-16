import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch((err) => console.error('[Shell] Failed to initialize federation manifest:', err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error('[Shell] Bootstrap error:', err));
