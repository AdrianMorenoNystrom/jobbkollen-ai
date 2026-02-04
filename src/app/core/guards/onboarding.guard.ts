import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

export const onboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return from(authService.getSession()).pipe(
    switchMap((session) => {
      if (!session) {
        router.navigate(['/auth']);
        return of(false);
      }
      return from(profileService.getMyProfile()).pipe(
        map((profile) => {
          if (!profile) {
            router.navigate(['/onboarding']);
            return false;
          }
          return true;
        })
      );
    })
  );
};
