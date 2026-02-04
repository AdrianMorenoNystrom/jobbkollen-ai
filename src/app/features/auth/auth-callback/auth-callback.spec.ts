import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthCallback } from './auth-callback';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('AuthCallback', () => {
  let fixture: ComponentFixture<AuthCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCallback],
      providers: [
        {
          provide: AuthService,
          useValue: { getSession: () => Promise.resolve(null) }
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
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallback);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
