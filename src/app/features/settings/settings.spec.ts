import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { ProfileService } from '../../core/services/profile.service';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  const profileStub = {
    getMyProfile: jasmine.createSpy().and.resolveTo({
      first_name: 'Ada',
      avatar_color: 'sunset',
      preferred_language: 'en',
      reminder_email: 'ada@example.com',
      reminders_enabled: false
    }),
    updateMyProfile: jasmine.createSpy().and.resolveTo({ error: null })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        {
          provide: AuthService,
          useValue: { signOut: () => Promise.resolve({ error: null }) }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: Router,
          useValue: { navigate: () => Promise.resolve(true) }
        },
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key, language: () => 'sv', setLanguage: () => undefined }
        },
        {
          provide: ProfileService,
          useValue: profileStub
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads profile data into the form', async () => {
    await fixture.whenStable();
    const form = (component as any).form as { value: any };
    expect(form.value.first_name).toBe('Ada');
    expect(form.value.avatar_color).toBe('sunset');
    expect(form.value.preferred_language).toBe('en');
  });

  it('saves settings via ProfileService', async () => {
    const form = (component as any).form;
    form.setValue({
      first_name: 'Test',
      avatar_color: 'teal',
      preferred_language: 'sv',
      reminder_email: '',
      reminders_enabled: true
    });

    await (component as any).save();

    expect(profileStub.updateMyProfile).toHaveBeenCalledWith({
      first_name: 'Test',
      avatar_color: 'teal',
      preferred_language: 'sv',
      reminder_email: null,
      reminders_enabled: true
    });
  });
});
