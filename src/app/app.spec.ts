import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './core/services/auth.service';
import { ProfileService } from './core/services/profile.service';
import { I18nService } from './core/i18n/i18n.service';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: AuthService,
          useValue: { authState$: of(null) }
        },
        {
          provide: ProfileService,
          useValue: { getMyProfile: () => Promise.resolve(null) }
        },
        {
          provide: I18nService,
          useValue: { setLanguage: () => undefined }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
