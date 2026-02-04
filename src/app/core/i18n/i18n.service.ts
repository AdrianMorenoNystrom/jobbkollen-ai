import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type AppLanguage = 'sv' | 'en';

type TranslationMap = Record<string, Record<AppLanguage, string>>;

const STORAGE_KEY = 'jobbkollen.language';

const TRANSLATIONS: TranslationMap = {
  'app.name': { sv: 'JobbKollen', en: 'JobbKollen' },
  'nav.jobs': { sv: 'Jobb', en: 'Jobs' },
  'nav.newJob': { sv: 'Skapa jobb', en: 'New job' },
  'nav.settings': { sv: 'Inställningar', en: 'Settings' },
  'landing.heroTitle': { sv: 'Håll koll på dina jobbansökningar', en: 'Track your job applications' },
  'landing.heroBody': {
    sv: 'Samla allt på ett ställe. Följ status, lägg uppföljningar och få smarta påminnelser.',
    en: 'Keep everything in one place. Track status, add follow-ups, and get smart reminders.'
  },
  'landing.ctaLogin': { sv: 'Logga in', en: 'Log in' },
  'landing.ctaSignup': { sv: 'Skapa konto', en: 'Create account' },
  'landing.feature1Title': { sv: 'Struktur', en: 'Structure' },
  'landing.feature1Body': {
    sv: 'Kortbaserad översikt för varje ansökan.',
    en: 'Card-based overview for each application.'
  },
  'landing.feature2Title': { sv: 'Uppföljning', en: 'Follow-ups' },
  'landing.feature2Body': {
    sv: 'Ställ in smarta datum för att höra av dig.',
    en: 'Set smart dates to check in.'
  },
  'landing.feature3Title': { sv: 'Påminnelser', en: 'Reminders' },
  'landing.feature3Body': {
    sv: 'Få e-postpåminnelser när det är dags.',
    en: 'Get email reminders when it is time.'
  },
  'landing.feature4Title': { sv: 'Mobil först', en: 'Mobile first' },
  'landing.feature4Body': {
    sv: 'Byggd för att användas på språng.',
    en: 'Built to be used on the go.'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly languageSignal = signal<AppLanguage>(this.loadInitialLanguage());

  readonly language = this.languageSignal.asReadonly();

  setLanguage(language: AppLanguage): void {
    this.languageSignal.set(language);
  }

  translate(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) {
      return key;
    }
    return entry[this.languageSignal()];
  }

  private loadInitialLanguage(): AppLanguage {
    if (typeof localStorage === 'undefined') {
      return 'sv';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'sv' || stored === 'en') {
      return stored;
    }
    return 'sv';
  }

  constructor() {
    effect(() => {
      const language = this.languageSignal();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, language);
      }
      if (this.document?.documentElement) {
        this.document.documentElement.lang = language;
      }
    });
  }
}
