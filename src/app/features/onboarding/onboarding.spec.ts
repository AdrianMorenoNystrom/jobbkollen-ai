import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Onboarding } from './onboarding';
import { ProfileService } from '../../core/services/profile.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('Onboarding', () => {
  let component: Onboarding;
  let fixture: ComponentFixture<Onboarding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Onboarding],
      providers: [
        {
          provide: ProfileService,
          useValue: { upsertMyProfile: () => Promise.resolve({ error: null }) }
        },
        {
          provide: I18nService,
          useValue: { language: () => 'sv', translate: (key: string) => key }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: Router,
          useValue: { navigate: () => Promise.resolve(true) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
