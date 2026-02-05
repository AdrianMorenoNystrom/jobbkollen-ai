import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { ProfileService } from '../../core/services/profile.service';
import { Avatar } from '../../shared/components/avatar/avatar';
import { AVATAR_COLORS } from '../../shared/data/avatar-palette';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-onboarding',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    Avatar,
    TranslatePipe
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  protected readonly colors = AVATAR_COLORS;

  protected readonly form = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    avatar_color: new FormControl('', [Validators.required])
  });

  protected isSaving = false;

  constructor(
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const firstName = this.form.controls.first_name.value?.trim() ?? '';
    const avatarColor = this.form.controls.avatar_color.value ?? '';

    this.isSaving = true;
    const { error } = await this.profileService.upsertMyProfile({
      first_name: firstName,
      avatar_color: avatarColor,
      preferred_language: this.i18n.language(),
      reminders_enabled: true
    });
    this.isSaving = false;

    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
      return;
    }

    await this.router.navigate(['/app/jobs']);
  }
}
