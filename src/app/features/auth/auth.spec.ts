import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signInWithOtp: () => Promise.resolve({ error: null }),
            verifyOtp: () => Promise.resolve({ error: null })
          }
        },
        {
          provide: ProfileService,
          useValue: { getMyProfile: () => Promise.resolve(null) }
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
          useValue: { translate: (key: string) => key, language: () => 'sv' }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
