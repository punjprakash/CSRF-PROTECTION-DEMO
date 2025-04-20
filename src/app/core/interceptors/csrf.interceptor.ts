import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfTokenService } from '../services/csrf-token.service';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfTokenService = inject(CsrfTokenService);

  // Only add CSRF token for state-changing requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next(req);
  }

  // Add token to the request
  return from(csrfTokenService.getToken()).pipe(
    switchMap(token => {
      const modifiedReq = req.clone({
        setHeaders: {
          'X-CSRF-TOKEN': token
        }
      });
      return next(modifiedReq);
    })
  );
};
