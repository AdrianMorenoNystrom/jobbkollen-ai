import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppShell } from './app-shell';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { I18nService } from '../../i18n/i18n.service';

describe('AppShell', () => {
  let component: AppShell;
  let fixture: ComponentFixture<AppShell>;

  beforeEach(async () => {
    const profileUpdated$ = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authState$: of(null),
            getCurrentSession: () => null,
            signOut: () => Promise.resolve({ error: null })
          }
        },
        {
          provide: ProfileService,
          useValue: {
            getMyProfile: () => Promise.resolve(null),
            updateMyProfile: () => Promise.resolve({ error: null }),
            profileUpdated$
          }
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
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
