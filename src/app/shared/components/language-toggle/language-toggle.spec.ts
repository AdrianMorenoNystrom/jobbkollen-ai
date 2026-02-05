import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageToggle } from './language-toggle';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('LanguageToggle', () => {
  let component: LanguageToggle;
  let fixture: ComponentFixture<LanguageToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageToggle],
      providers: [
        {
          provide: AuthService,
          useValue: { getSession: () => Promise.resolve(null) }
        },
        {
          provide: ProfileService,
          useValue: {
            getMyProfile: () => Promise.resolve({ id: '1', preferred_language: 'sv' }),
            updateMyProfile: () => Promise.resolve({ error: null })
          }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key, language: () => 'sv', setLanguage: () => undefined }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
