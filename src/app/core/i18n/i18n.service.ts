import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type AppLanguage = 'sv' | 'en';

type TranslationMap = Record<string, Record<AppLanguage, string>>;

const STORAGE_KEY = 'jobbkollen.language';

const TRANSLATIONS: TranslationMap = {
  'app.name': { sv: 'JobbKollen', en: 'JobbKollen' },
  'common.ok': { sv: 'OK', en: 'OK' },
  'common.save': { sv: 'Spara', en: 'Save' },
  'common.cancel': { sv: 'Avbryt', en: 'Cancel' },
  'common.edit': { sv: 'Redigera', en: 'Edit' },
  'aria.languageToggle': { sv: 'Språk', en: 'Language' },
  'aria.openNavigation': { sv: 'Öppna navigationsmeny', en: 'Open navigation menu' },
  'aria.openUserMenu': { sv: 'Öppna användarmeny', en: 'Open user menu' },
  'nav.jobs': { sv: 'Jobb', en: 'Jobs' },
  'nav.newJob': { sv: 'Skapa jobb', en: 'New job' },
  'nav.settings': { sv: 'Inställningar', en: 'Settings' },
  'jobs.subtitle': { sv: 'Översikt över dina ansökningar.', en: 'Overview of your applications.' },
  'jobs.statusLabel': { sv: 'Status', en: 'Status' },
  'jobForm.title': { sv: 'Jobbformulär', en: 'Job form' },
  'jobForm.subtitle': { sv: 'Skapa eller uppdatera jobb', en: 'Create or update a job' },
  'jobForm.placeholder': {
    sv: 'Formulärfält kommer i nästa milstolpe.',
    en: 'Form fields will arrive in the next milestone.'
  },
  'settings.title': { sv: 'Inställningar', en: 'Settings' },
  'settings.subtitle': { sv: 'Profil och påminnelser', en: 'Profile and reminders' },
  'settings.placeholder': {
    sv: 'Inställningsformulär kommer i nästa milstolpe.',
    en: 'Settings form will arrive in the next milestone.'
  },
  'settings.languageLabel': { sv: 'Språk', en: 'Language' },
  'settings.languageHint': { sv: 'Välj språk för appen.', en: 'Choose the app language.' },
  'settings.languageError': { sv: 'Välj ett språk.', en: 'Select a language.' },
  'settings.languageSv': { sv: 'Svenska', en: 'Swedish' },
  'settings.languageEn': { sv: 'Engelska', en: 'English' },
  'settings.reminderEmailLabel': { sv: 'Påminnelsemejl', en: 'Reminder email' },
  'settings.reminderEmailHint': {
    sv: 'Valfritt. Används för påminnelser.',
    en: 'Optional. Used for reminders.'
  },
  'settings.reminderEmailError': {
    sv: 'Ange en giltig e-postadress.',
    en: 'Enter a valid email address.'
  },
  'settings.remindersEnabledLabel': { sv: 'Aktivera påminnelser', en: 'Enable reminders' },
  'settings.remindersEnabledHint': {
    sv: 'Få e-postpåminnelser om uppföljningar.',
    en: 'Get email reminders about follow-ups.'
  },
  'settings.saved': { sv: 'Inställningar sparade.', en: 'Settings saved.' },
  'auth.title': { sv: 'Logga in', en: 'Sign in' },
  'auth.subtitle': { sv: 'Få en engångskod via e-post', en: 'Get a one-time code by email' },
  'auth.emailLabel': { sv: 'E-post', en: 'Email' },
  'auth.emailError': { sv: 'Ange en giltig e-postadress.', en: 'Enter a valid email address.' },
  'auth.codeLabel': { sv: 'Engångskod', en: 'One-time code' },
  'auth.codeError': { sv: 'Ange koden från mailet.', en: 'Enter the code from the email.' },
  'auth.emailHint': { sv: 'Vi skickar en kod till din e-post.', en: 'We will send a code to your email.' },
  'auth.codeHint': { sv: 'Skriv in koden från mailet.', en: 'Enter the code from the email.' },
  'auth.sendCode': { sv: 'Skicka kod', en: 'Send code' },
  'auth.verifyCode': { sv: 'Verifiera kod', en: 'Verify code' },
  'auth.back': { sv: 'Tillbaka', en: 'Back' },
  'auth.otpSent': { sv: 'Vi har skickat en kod till din e-post.', en: 'We sent a code to your email.' },
  'auth.callbackTitle': { sv: 'Slutför inloggning', en: 'Completing sign-in' },
  'auth.callbackWait': { sv: 'Vänta lite…', en: 'Please wait…' },
  'auth.callbackError': { sv: 'Inloggningen kunde inte slutföras.', en: 'Sign-in could not be completed.' },
  'onboarding.title': { sv: 'Välkommen', en: 'Welcome' },
  'onboarding.subtitle': { sv: 'Skapa din profil', en: 'Create your profile' },
  'onboarding.firstNameLabel': { sv: 'Förnamn', en: 'First name' },
  'onboarding.firstNameError': { sv: 'Förnamn krävs.', en: 'First name is required.' },
  'onboarding.avatarTitle': { sv: 'Välj avatarfärg', en: 'Choose an avatar color' },
  'onboarding.avatarSubtitle': { sv: 'Välj en färg som känns som du.', en: 'Pick a color that feels like you.' },
  'onboarding.avatarAria': { sv: 'Avatarfärg', en: 'Avatar color' },
  'onboarding.colorPrefix': { sv: 'Avatarfärg', en: 'Avatar color' },
  'onboarding.avatarError': { sv: 'Välj en färg.', en: 'Pick a color.' },
  'onboarding.save': { sv: 'Spara', en: 'Save' },
  'menu.signOut': { sv: 'Logga ut', en: 'Sign out' },
  'toast.signOut': { sv: 'Du är utloggad.', en: 'You are signed out.' },
  'avatar.label': { sv: 'Avatar', en: 'Avatar' },
  'color.sunset': { sv: 'Solnedgång', en: 'Sunset' },
  'color.coral': { sv: 'Korall', en: 'Coral' },
  'color.rose': { sv: 'Ros', en: 'Rose' },
  'color.plum': { sv: 'Plommon', en: 'Plum' },
  'color.indigo': { sv: 'Indigo', en: 'Indigo' },
  'color.sky': { sv: 'Himmel', en: 'Sky' },
  'color.teal': { sv: 'Turkos', en: 'Teal' },
  'color.emerald': { sv: 'Smaragd', en: 'Emerald' },
  'color.lime': { sv: 'Lime', en: 'Lime' },
  'color.amber': { sv: 'Bärnsten', en: 'Amber' },
  'color.slate': { sv: 'Skiffer', en: 'Slate' },
  'color.chocolate': { sv: 'Choklad', en: 'Chocolate' },
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
