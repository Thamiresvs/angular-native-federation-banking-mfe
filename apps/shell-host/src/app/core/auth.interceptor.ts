import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from './auth-session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthSessionService).session();
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${session.token}`,
      'X-Client-Channel': 'FINCORE-MFE-SHELL',
    },
  });
  return next(cloned);
};
