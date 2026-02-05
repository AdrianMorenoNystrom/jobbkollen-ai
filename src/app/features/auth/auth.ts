import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required])
  });

  protected otpSent = false;
  protected isLoading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async sendOtp() {
    if (this.form.controls.email.invalid) {
      this.form.controls.email.markAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.form.controls.email.value ?? '';
    const { error } = await this.auth.signInWithOtp(email);
    this.isLoading = false;

    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
      return;
    }

    this.otpSent = true;
    this.snackBar.open(this.i18n.translate('auth.otpSent'), this.i18n.translate('common.ok'), {
      duration: 4000
    });
  }

  async verifyOtp() {
    const email = this.form.controls.email.value ?? '';
    const code = this.form.controls.code.value ?? '';

    if (!code) {
      this.form.controls.code.markAsTouched();
      return;
    }

    this.isLoading = true;
    const { error } = await this.auth.verifyOtp(email, code);
    this.isLoading = false;

    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
      return;
    }

    await this.redirectAfterLogin();
  }

  private async redirectAfterLogin() {
    const profile = await this.profileService.getMyProfile();
    if (!profile) {
      await this.router.navigate(['/onboarding']);
      return;
    }
    await this.router.navigate(['/app/jobs']);
  }
}
