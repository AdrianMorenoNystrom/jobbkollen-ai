import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.getSession()).pipe(
    map((session) => {
      if (session) {
        return true;
      }
      router.navigate(['/auth']);
      return false;
    })
  );
};
