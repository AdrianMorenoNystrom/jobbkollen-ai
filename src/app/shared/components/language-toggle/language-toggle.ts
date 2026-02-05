import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AppLanguage, I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-toggle',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.scss'
})
export class LanguageToggle {
  protected readonly languages: { value: AppLanguage; label: string }[] = [
    { value: 'sv', label: 'SV' },
    { value: 'en', label: 'EN' }
  ];

  constructor(protected readonly i18n: I18nService) {}

  protected setLanguage(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }
}
