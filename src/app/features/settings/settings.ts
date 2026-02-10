import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppLanguage, I18nService } from '../../core/i18n/i18n.service';
import { ProfileService } from '../../core/services/profile.service';
import { Avatar } from '../../shared/components/avatar/avatar';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { AVATAR_COLORS } from '../../shared/data/avatar-palette';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    Avatar,
    PageHeader,
    TranslatePipe
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly colors = AVATAR_COLORS;
  protected readonly languages: { value: AppLanguage; labelKey: string }[] = [
    { value: 'sv', labelKey: 'settings.languageSv' },
    { value: 'en', labelKey: 'settings.languageEn' }
  ];

  protected readonly form = new FormGroup({
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    avatar_color: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    preferred_language: new FormControl<AppLanguage>('sv', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    reminder_email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email]
    }),
    reminders_enabled: new FormControl(true, { nonNullable: true })
  });

  protected isSaving = false;
  protected isLoading = false;

  constructor(
    private readonly profileService: ProfileService,
    private readonly auth: AuthService,
    private readonly i18n: I18nService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    effect(() => {
      const language = this.i18n.language();
      if (language && this.form.controls.preferred_language.value !== language) {
        this.form.controls.preferred_language.setValue(language, { emitEvent: false });
      }
    });

    void this.loadProfile();
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const reminderEmail = this.form.controls.reminder_email.value.trim();
    const payload = {
      first_name: this.form.controls.first_name.value.trim(),
      avatar_color: this.form.controls.avatar_color.value,
      preferred_language: this.form.controls.preferred_language.value,
      reminder_email: reminderEmail ? reminderEmail : null,
      reminders_enabled: this.form.controls.reminders_enabled.value
    };

    this.isSaving = true;
    try {
      const { error } = await this.profileService.updateMyProfile(payload);

      if (error) {
        this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
        return;
      }

      this.snackBar.open(this.i18n.translate('settings.saved'), this.i18n.translate('common.ok'), {
        duration: 3000
      });
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  protected async onLanguageChange(language: AppLanguage): Promise<void> {
    if (!language) {
      return;
    }

    this.i18n.setLanguage(language);
    const { error } = await this.profileService.updateMyProfile({
      preferred_language: language
    });
    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
    }
  }

  async signOut() {
    const { error } = await this.auth.signOut();
    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
      return;
    }
    this.snackBar.open(this.i18n.translate('toast.signOut'), this.i18n.translate('common.ok'), {
      duration: 3000
    });
    await this.router.navigate(['/']);
  }

  private async loadProfile(): Promise<void> {
    this.isLoading = true;
    const profile = await this.profileService.getMyProfile();
    this.isLoading = false;

    if (!profile) {
      return;
    }

    this.form.patchValue(
      {
        first_name: profile.first_name ?? '',
        avatar_color: profile.avatar_color ?? '',
        preferred_language: profile.preferred_language ?? this.i18n.language(),
        reminder_email: profile.reminder_email ?? '',
        reminders_enabled: profile.reminders_enabled ?? true
      },
      { emitEvent: false }
    );

    if (profile.preferred_language) {
      this.i18n.setLanguage(profile.preferred_language);
    }
  }
}
