import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-auth-callback',
  imports: [MatCardModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss'
})
export class AuthCallback {
  constructor(
    private readonly auth: AuthService,
    private readonly profileService: ProfileService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    void this.handleCallback();
  }

  private async handleCallback() {
    const session = await this.auth.getSession();
    if (!session) {
      this.snackBar.open('Inloggningen kunde inte slutföras.', 'OK', { duration: 4000 });
      await this.router.navigate(['/auth']);
      return;
    }

    const profile = await this.profileService.getMyProfile();
    if (!profile) {
      await this.router.navigate(['/onboarding']);
      return;
    }

    await this.router.navigate(['/app/jobs']);
  }
}
