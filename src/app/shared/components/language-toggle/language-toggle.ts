import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppLanguage, I18nService } from '../../../core/i18n/i18n.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-toggle',
  imports: [MatButtonToggleModule, MatSnackBarModule, TranslatePipe],
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.scss'
})
export class LanguageToggle {
  protected readonly languages: { value: AppLanguage; label: string }[] = [
    { value: 'sv', label: 'SV' },
    { value: 'en', label: 'EN' }
  ];

  constructor(
    protected readonly i18n: I18nService,
    private readonly auth: AuthService,
    private readonly profileService: ProfileService,
    private readonly snackBar: MatSnackBar
  ) {}

  protected async setLanguage(language: AppLanguage): Promise<void> {
    this.i18n.setLanguage(language);
    const session = await this.auth.getSession();
    if (!session) {
      return;
    }
    const profile = await this.profileService.getMyProfile();
    if (!profile) {
      return;
    }
    const { error } = await this.profileService.updateMyProfile({
      preferred_language: language
    });
    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
    }
  }
}
