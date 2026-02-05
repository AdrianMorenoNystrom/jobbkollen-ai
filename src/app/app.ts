import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './core/services/auth.service';
import { ProfileService } from './core/services/profile.service';
import { I18nService } from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.authService.authState$
      .pipe(
        switchMap((session) =>
          session ? from(this.profileService.getMyProfile()) : of(null)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((profile) => {
        if (profile?.preferred_language) {
          this.i18n.setLanguage(profile.preferred_language);
        }
      });
  }
}
