import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return from(authService.getSession()).pipe(
    switchMap((session) => {
      if (!session) {
        return of(true);
      }
      return from(profileService.getMyProfile()).pipe(
        map((profile) => {
          router.navigate([profile ? '/app/jobs' : '/onboarding']);
          return false;
        })
      );
    })
  );
};
