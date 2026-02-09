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
  'jobs.appliedOn': { sv: 'Ansökt', en: 'Applied on' },
  'jobs.appliedOnUnknown': { sv: 'Okänt datum', en: 'Unknown date' },
  'jobs.locationUnknown': { sv: 'Okänd plats', en: 'Unknown location' },
  'jobs.followUpOn': { sv: 'Uppföljning', en: 'Follow-up' },
  'jobs.followUpToday': { sv: 'Idag', en: 'Today' },
  'jobs.followUpInDays': { sv: 'om {days} dagar', en: 'in {days} days' },
  'jobs.followUpOverdue': { sv: '{days} dagar försenad', en: '{days} days overdue' },
  'jobs.followUpDueSoon': { sv: 'Snart dags', en: 'Due soon' },
  'jobs.jobUrlLabel': { sv: 'Jobbannons', en: 'Job posting' },
  'jobs.jobUrlEmpty': { sv: 'Ingen länk angiven', en: 'No link provided' },
  'jobs.notes.label': { sv: 'Anteckningar', en: 'Notes' },
  'jobs.notes.open': { sv: 'Visa anteckningar', en: 'View notes' },
  'jobs.notes.add': { sv: 'Lägg till anteckningar', en: 'Add notes' },
  'jobs.notes.edit': { sv: 'Redigera anteckningar', en: 'Edit notes' },
  'jobs.notes.empty': { sv: 'Inga anteckningar', en: 'No notes' },
  'jobs.notes.title': { sv: 'Anteckningar', en: 'Notes' },
  'jobs.notes.saved': { sv: 'Anteckningar sparade.', en: 'Notes saved.' },
  'jobs.notes.saveError': { sv: 'Kunde inte spara anteckningar.', en: 'Could not save notes.' },
  'jobs.filter.searchLabel': { sv: 'Sök', en: 'Search' },
  'jobs.filter.searchPlaceholder': { sv: 'Sök titel eller företag', en: 'Search title or company' },
  'jobs.filter.statusLabel': { sv: 'Statusfilter', en: 'Status filter' },
  'jobs.filter.allStatuses': { sv: 'Alla statusar', en: 'All statuses' },
  'jobs.empty.title': { sv: 'Inga jobb ännu', en: 'No jobs yet' },
  'jobs.empty.body': {
    sv: 'Lägg till ditt första jobb för att börja följa ansökningar.',
    en: 'Add your first job to start tracking applications.'
  },
  'jobs.empty.cta': { sv: 'Skapa jobb', en: 'Create job' },
  'jobs.noResults.title': { sv: 'Inga träffar', en: 'No results' },
  'jobs.noResults.body': { sv: 'Justera filter eller sökord.', en: 'Adjust your filters or search.' },
  'jobs.delete.title': { sv: 'Ta bort jobb', en: 'Delete job' },
  'jobs.delete.body': {
    sv: 'Är du säker på att du vill ta bort jobbet? Detta går inte att ångra.',
    en: 'Are you sure you want to delete this job? This cannot be undone.'
  },
  'jobs.delete.confirm': { sv: 'Ta bort', en: 'Delete' },
  'jobs.delete.cancel': { sv: 'Avbryt', en: 'Cancel' },
  'jobs.delete.success': { sv: 'Jobbet togs bort.', en: 'Job deleted.' },
  'jobs.delete.error': { sv: 'Kunde inte ta bort jobbet.', en: 'Could not delete job.' },
  'jobs.loadError': { sv: 'Kunde inte hämta jobb.', en: 'Could not load jobs.' },
  'jobs.deleteAria': { sv: 'Ta bort jobb', en: 'Delete job' },
  'jobs.editAria': { sv: 'Redigera jobb', en: 'Edit job' },
  'jobs.status.applied': { sv: 'Ansökt', en: 'Applied' },
  'jobs.status.interview': { sv: 'Intervju', en: 'Interview' },
  'jobs.status.offer': { sv: 'Erbjudande', en: 'Offer' },
  'jobs.status.rejected': { sv: 'Avslag', en: 'Rejected' },
  'jobs.status.withdrawn': { sv: 'Tillbakadragen', en: 'Withdrawn' },
  'jobForm.createTitle': { sv: 'Skapa jobb', en: 'Create job' },
  'jobForm.editTitle': { sv: 'Redigera jobb', en: 'Edit job' },
  'jobForm.createSubtitle': { sv: 'Lägg till en ny ansökan', en: 'Add a new application' },
  'jobForm.editSubtitle': { sv: 'Uppdatera din ansökan', en: 'Update your application' },
  'jobForm.titleLabel': { sv: 'Titel', en: 'Title' },
  'jobForm.companyLabel': { sv: 'Företag', en: 'Company' },
  'jobForm.locationLabel': { sv: 'Plats', en: 'Location' },
  'jobForm.appliedOnLabel': { sv: 'Ansökningsdatum', en: 'Applied on' },
  'jobForm.statusLabel': { sv: 'Status', en: 'Status' },
  'jobForm.notesLabel': { sv: 'Anteckningar', en: 'Notes' },
  'jobForm.notesHint': { sv: 'Valfritt', en: 'Optional' },
  'jobForm.jobUrlLabel': { sv: 'Jobbannons (URL)', en: 'Job posting (URL)' },
  'jobForm.jobUrlHint': { sv: 'Valfritt. Måste börja med http eller https.', en: 'Optional. Must start with http or https.' },
  'jobForm.jobUrlError': { sv: 'Ange en giltig URL.', en: 'Enter a valid URL.' },
  'jobForm.followUpPresetLabel': { sv: 'Uppföljning', en: 'Follow-up' },
  'jobForm.followUpPresetHint': { sv: 'Välj ett intervall för uppföljning.', en: 'Choose a follow-up interval.' },
  'jobForm.followUpNone': { sv: 'Ingen', en: 'None' },
  'jobForm.followUp5bd': { sv: '5 arbetsdagar', en: '5 business days' },
  'jobForm.followUp1w': { sv: '1 vecka', en: '1 week' },
  'jobForm.followUp2w': { sv: '2 veckor', en: '2 weeks' },
  'jobForm.followUpOnLabel': { sv: 'Uppföljningsdatum', en: 'Follow-up date' },
  'jobForm.followUpOnHint': { sv: 'Valfritt datum för uppföljning.', en: 'Optional follow-up date.' },
  'jobForm.followUpCalculatedEmpty': { sv: 'Ingen uppföljning', en: 'No follow-up' },
  'jobForm.followUpCalculatedHint': {
    sv: 'Beräknas automatiskt utifrån ansökningsdatum och val.',
    en: 'Calculated automatically from the applied date and selection.'
  },
  'jobForm.requiredError': { sv: 'Fältet är obligatoriskt.', en: 'This field is required.' },
  'jobForm.saveError': { sv: 'Kunde inte spara jobbet.', en: 'Could not save job.' },
  'jobForm.saved': { sv: 'Jobbet sparades.', en: 'Job saved.' },
  'jobForm.loadError': { sv: 'Kunde inte hämta jobbet.', en: 'Could not load job.' },
  'jobForm.delete': { sv: 'Ta bort', en: 'Delete' },
  'jobForm.deleteError': { sv: 'Kunde inte ta bort jobbet.', en: 'Could not delete job.' },
  'jobForm.deleteSuccess': { sv: 'Jobbet togs bort.', en: 'Job deleted.' },
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
